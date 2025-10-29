"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentTransaction } from "@/types/types";
import { generateTransactionPDF } from "@/lib/pdfGenerator";
import { Download, CreditCard, AlertCircle, LogOut } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app"; 
// --- THE FIX: Define a specific type for the subscription state ---
interface SubscriptionState {
  planName: string;
  status: 'active' | 'inactive' | 'pending' | string; // Allow for other potential statuses
}

// --- Sub-components ---
function UsageStats() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<Record<string, number>>({});
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "generations"));
    const unsub = onSnapshot(q, (snapshot) => {
      const counts: Record<string, number> = {};
      snapshot.forEach(doc => {
        const data = doc.data() as { modelId?: string };
        const modelId = data.modelId || "unknown";
        counts[modelId] = (counts[modelId] || 0) + 1;
      });
      setUsage(counts);
    });
    return () => unsub();
  }, [user]);
  if (Object.keys(usage).length === 0) {
    return (
      <Card className="bg-[#1C1C1C] border-neutral-800 p-4 text-center text-neutral-400 text-sm">
        No usage data yet. <Link href="/explore" className="text-white underline">Start creating</Link> to see your stats.
      </Card>
    );
  }
  return (
    <div>
        <h2 className="font-semibold text-lg mb-4">Usage per model</h2>
        <div className="space-y-3">
            {Object.entries(usage).map(([modelId, count]) => (
                 <div key={modelId} className="flex justify-between items-center text-neutral-400">
                    <p className="capitalize">{modelId.replace(/-/g, ' ')}</p>
                    <p>{count} Generations</p>
                 </div>
            ))}
        </div>
    </div>
  );
}

function BillingHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<PaymentTransaction[]>([]);
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "payments"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentTransaction)));
    });
    return () => unsub();
  }, [user]);
  if (history.length === 0) {
    return (
      <div>
        <h2 className="font-semibold text-lg mb-4">Billing History</h2>
        <Card className="bg-[#1C1C1C] border-neutral-800 p-4 text-center text-neutral-400 text-sm">
          No billing history found. <Link href="/pricing" className="text-white underline">Purchase credits</Link> to get started.
        </Card>
      </div>
    );
  }
  return (
     <div>
        <h2 className="font-semibold text-lg mb-4">Billing History</h2>
        <div className="space-y-4">
            {history.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b border-neutral-800 pb-2">
                    <div>
                        <p className="text-sm text-neutral-300">{item.createdAt?.toDate().toLocaleDateString()}</p>
                        <p className="font-medium">€{item.amount} - {item.type || 'Purchase'}</p>
                        <Badge 
                          variant={item.status === 'paid' ? 'default' : 'secondary'}
                          className={item.status === 'paid' ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'}
                        >
                          {item.status}
                        </Badge>
                    </div>
                    {item.status === 'paid' && (
                      <button 
                        onClick={() => { 
                          if (user) { 
                            generateTransactionPDF(item, user.displayName || user.email!, user.email!); 
                          } 
                        }} 
                        className="text-sm text-white hover:text-neutral-300 flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4"/> Invoice
                      </button>
                    )}
                </div>
            ))}
        </div>
     </div>
  );
}

function SubscriptionStatus() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionState|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchSubscription = async () => {
      try {
        // Get user document to check active plan and subscription status
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        
        if (userData?.activePlan && userData.activePlan !== "Starter") {
          setSubscription({
            planName: userData.activePlan,
            status: userData.subscriptionStatus || "active",
          });
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (loading) return null;

  if (!subscription || subscription.planName === "Starter") {
    return (
      <div className="mb-8">
        <Alert className="bg-neutral-900 border-neutral-800">
          <CreditCard className="h-4 w-4" />
          <AlertDescription>
            You&apos;re currently on the <strong>Starter</strong> plan. <Link href="/pricing" className="underline">Upgrade to unlock more credits</Link> and premium features.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-700/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-neutral-400">Active Subscription</p>
            <h3 className="text-2xl font-bold text-white">{subscription.planName} Plan</h3>
          </div>
          <Badge 
            variant={subscription.status === 'active' ? 'default' : 'secondary'}
            className={subscription.status === 'active' ? 'bg-green-600' : 'bg-yellow-600'}
          >
            {subscription.status}
          </Badge>
        </div>
        <p className="text-sm text-neutral-300 mb-4">
          Your subscription renews automatically each month. Credits are added to your account upon successful payment.
        </p>
        <div className="flex gap-3">
          <Link href="/pricing">
            <Button variant="outline" className="border-neutral-700">
              Change Plan
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

// --- Main Page Component ---
export default function AccountPage() {
    const { user, credits } = useAuth();
    const router = useRouter();
    const [activePlan, setActivePlan] = useState("Starter");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
      if (!user) return;
      
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setActivePlan(userData?.activePlan || "Starter");
        }
      });

      return () => unsubscribe();
    }, [user]);

    const handleSaveChanges = async () => {
      if (!user) return;
      
      setIsSaving(true);
      setSaveMessage(null);
      
      try {
        const { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } = await import('firebase/auth');
        
        // If changing password, validate
        if (newPassword || confirmPassword || currentPassword) {
          if (!currentPassword) {
            throw new Error("Current password is required to change password");
          }
          if (newPassword !== confirmPassword) {
            throw new Error("New passwords do not match");
          }
          if (newPassword.length < 6) {
            throw new Error("New password must be at least 6 characters");
          }
          
          // Re-authenticate before password change
          const credential = EmailAuthProvider.credential(
            user.email!,
            currentPassword
          );
          await reauthenticateWithCredential(user, credential);
          
          // Update password
          await updatePassword(user, newPassword);
        }
        
        // Update display name if changed
        if (displayName !== user.displayName) {
          await updateProfile(user, { displayName });
        }
        
        // Update email if changed
        if (email !== user.email && email) {
          // Re-authenticate if not already done
          if (!currentPassword && !newPassword) {
            throw new Error("Please enter your current password to change your email");
          }
          
          if (!newPassword) {
            const credential = EmailAuthProvider.credential(
              user.email!,
              currentPassword
            );
            await reauthenticateWithCredential(user, credential);
          }
          
          await updateEmail(user, email);
        }
        
        // Update Firestore user document
        const userDocRef = doc(db, "users", user.uid);
        await import('firebase/firestore').then(({ updateDoc }) => 
          updateDoc(userDocRef, {
            name: displayName,
            email: email
          })
        );
        
        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        setSaveMessage({ type: 'success', text: 'Account updated successfully!' });
        setTimeout(() => setSaveMessage(null), 3000);
      } catch (error) {
        console.error("Error updating account:", error);
        let errorMessage = "Failed to update account";
        
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case 'auth/requires-recent-login':
              errorMessage = "Please sign out and sign in again to change your email";
              break;
            case 'auth/email-already-in-use':
              errorMessage = "This email is already in use";
              break;
            case 'auth/invalid-email':
              errorMessage = "Invalid email address";
              break;
            default:
              errorMessage = error.message;
              break;
          }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        
        setSaveMessage({ type: 'error', text: errorMessage });
      } finally {
        setIsSaving(false);
      }
    };

    const handleCancel = () => {
      setDisplayName(user?.displayName || "");
      setEmail(user?.email || "");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaveMessage(null);
    };

    const handleLogout = async () => {
      setIsLoggingOut(true);
      try {
        const { signOut } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase');
        await signOut(auth);
        router.push('/signin');
      } catch (error) {
        console.error("Error logging out:", error);
        setIsLoggingOut(false);
      }
    };

    if (!user) {
        return <div className="text-white text-center pt-48">Loading user profile...</div>;
    }

    const inputStyles = "bg-transparent border-0 border-b border-neutral-700 rounded-none px-0 focus-visible:ring-0 focus-visible:border-b-white";

    return (
        <div className="bg-black text-white min-h-screen pt-32">
            <div className="container mx-auto py-16 px-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-16 text-center sm:text-left">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex-shrink-0 flex items-center justify-center text-3xl font-bold">
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">{user.displayName || "User"}</h1>
                        <p className="text-neutral-400">{user.email}</p>
                    </div>
                </div>

                {/* Subscription Status */}
                <SubscriptionStatus />

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
                    {/* Left Column - Stats & CTA */}
                    <div className="lg:col-span-1 space-y-12 order-2 lg:order-1">
                        <UsageStats />
                        <div>
                            <p className="text-neutral-300 mb-2">Need more credits?</p>
                            <Link href="/pricing">
                              <Button className="bg-[#D4FF4F] text-black hover:bg-[#c2ef4a] font-semibold w-full">
                                View Pricing Plans
                              </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Credits Display */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                       <Card className="bg-[#1C1C1C] border-neutral-800 p-8 text-center">
                            <p className="text-neutral-400 mb-2">Active Plan</p>
                            <p className="text-4xl font-bold mb-6">{activePlan}</p>
                            <Separator className="bg-neutral-800 mb-6" />
                            <p className="text-neutral-400 mb-2">Available Credits</p>
                            <p className="text-7xl font-bold mb-4">{credits}</p>
                            <p className="text-sm text-neutral-500">
                              {activePlan === "Starter" 
                                ? "One-time credits. Purchase more anytime." 
                                : "Monthly credits refresh automatically with your subscription."}
                            </p>
                       </Card>
                    </div>
                </div>

                <Separator className="my-16 bg-neutral-800" />

                {/* Bottom Grid - History & Settings */}
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Billing History */}
                    <BillingHistory />

                    {/* User Settings */}
                    <div>
                         <h2 className="font-semibold text-lg mb-4">Account Settings</h2>
                         
                         {saveMessage && (
                           <Alert className={`mb-4 ${saveMessage.type === 'success' ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
                             <AlertDescription className={saveMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                               {saveMessage.text}
                             </AlertDescription>
                           </Alert>
                         )}
                         
                         <div className="space-y-4">
                            <div>
                              <label className="text-sm text-neutral-400 mb-1 block">Display Name</label>
                              <Input 
                                placeholder="Your name" 
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className={inputStyles} 
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm text-neutral-400 mb-1 block">Email Address</label>
                              <Input 
                                type="email"
                                placeholder="your@email.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputStyles}
                              />
                              <p className="text-xs text-neutral-500 mt-1">
                                You may need to sign in again after changing your email
                              </p>
                            </div>

                            <Separator className="bg-neutral-800 my-6" />

                            <div>
                              <h3 className="text-sm font-medium mb-3">Change Password</h3>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm text-neutral-400 mb-1 block">Current Password</label>
                                  <Input 
                                    type="password"
                                    placeholder="Enter current password" 
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className={inputStyles}
                                  />
                                </div>
                                
                                <div>
                                  <label className="text-sm text-neutral-400 mb-1 block">New Password</label>
                                  <Input 
                                    type="password"
                                    placeholder="Enter new password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className={inputStyles}
                                  />
                                </div>
                                
                                <div>
                                  <label className="text-sm text-neutral-400 mb-1 block">Confirm New Password</label>
                                  <Input 
                                    type="password"
                                    placeholder="Confirm new password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={inputStyles}
                                  />
                                </div>
                                
                                <p className="text-xs text-neutral-500">
                                  Password must be at least 6 characters. Leave blank to keep current password.
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button 
                                  variant="ghost" 
                                  onClick={handleCancel}
                                  disabled={isSaving}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  className="bg-white text-black hover:bg-neutral-200 font-semibold"
                                  onClick={handleSaveChanges}
                                  disabled={isSaving}
                                >
                                  {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                         </div>

                         {/* Payment Info Notice */}
                         <Card className="bg-neutral-900 border-neutral-800 p-4 mt-8">
                            <div className="flex gap-3">
                              <AlertCircle className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium mb-1">Payment Management</p>
                                <p className="text-xs text-neutral-400">
                                  All payments are securely processed through PayTrust. To update your payment method or view detailed invoices, simply make a new purchase and use your preferred payment method.
                                </p>
                              </div>
                            </div>
                         </Card>

                         {/* Logout Section */}
                         <Separator className="bg-neutral-800 my-8" />
                         
                         <div>
                            <h3 className="text-sm font-medium mb-2">Danger Zone</h3>
                            <p className="text-xs text-neutral-400 mb-4">
                              Sign out of your account on this device
                            </p>
                            <Button 
                              variant="destructive"
                              onClick={handleLogout}
                              disabled={isLoggingOut}
                              className="w-full sm:w-auto"
                            >
                              {isLoggingOut ? (
                                "Signing out..."
                              ) : (
                                <>
                                  <LogOut className="mr-2 h-4 w-4" />
                                  Sign Out
                                </>
                              )}
                            </Button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}