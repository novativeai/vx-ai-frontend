"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, doc, getDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PaymentTransaction } from "@/types/types";
import { generateTransactionPDF } from "@/lib/pdfGenerator";
import { Download, AlertCircle, LogOut } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";
import { FirebaseError } from "firebase/app";
import { AccountNav, AccountNavMobile, type AccountTab } from "@/components/AccountNav";
import { HistoryCard } from "@/components/HistoryCard";
import { PurchasedVideos } from "@/components/PurchasedVideos";
import { SellerEarningsCard } from "@/components/SellerEarningsCard";
import { SellerTransactions } from "@/components/SellerTransactions";
import { PayoutRequestsTable } from "@/components/PayoutRequestsTable";
import { WithdrawalRequestModal } from "@/components/WithdrawalRequestModal";
import { SellerSettingsCard } from "@/components/SellerSettingsCard";
import { Generation } from "@/types/types"; 
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
      <Card className="bg-[#111111FF] border-neutral-800 p-4 text-center text-neutral-400 text-sm">
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
        logger.error("Error fetching subscription", error);
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
    const [activeTab, setActiveTab] = useState<AccountTab>("account");
    const [activePlan, setActivePlan] = useState("Starter");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [history, setHistory] = useState<Generation[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const [sellerBalance, setSellerBalance] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Load history for History tab
    useEffect(() => {
      if (!user) {
        setIsLoadingHistory(false);
        return;
      }
      const q = query(collection(db, "users", user.uid, "generations"), orderBy("createdAt", "desc"));
      const unsub = onSnapshot(q, (snapshot) => {
        setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Generation)));
        setIsLoadingHistory(false);
      });
      return () => unsub();
    }, [user]);

    // Load seller balance for Seller tab
    useEffect(() => {
      if (!user) return;
      const balanceRef = doc(db, "users", user.uid, "seller_balance", "current");
      const unsub = onSnapshot(balanceRef, (doc) => {
        if (doc.exists()) {
          setSellerBalance(doc.data().availableBalance || 0);
        }
      });
      return () => unsub();
    }, [user]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const handleSaveChanges = async () => {
      if (!user) return;

      setIsSaving(true);
      setSaveMessage(null);

      let authUpdatesSucceeded = false;

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

        // Auth updates succeeded - mark this before Firestore operation
        authUpdatesSucceeded = true;

        // Update Firestore user document separately - don't fail if this fails
        try {
          const userDocRef = doc(db, "users", user.uid);
          const { updateDoc } = await import('firebase/firestore');
          await updateDoc(userDocRef, {
            firstName: displayName.split(' ')[0] || displayName,
            lastName: displayName.split(' ').slice(1).join(' ') || '',
            email: email
          });
        } catch {
          // Firestore sync delayed - don't fail, it will sync on next load
        }

        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setSaveMessage({ type: 'success', text: 'Account updated successfully!' });
        timeoutRef.current = setTimeout(() => setSaveMessage(null), 3000);
      } catch (error) {
        // Only show error if auth updates failed
        if (!authUpdatesSucceeded) {
          logger.error("Error updating account", error);
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
              case 'auth/wrong-password':
                errorMessage = "Current password is incorrect";
                break;
              default:
                errorMessage = error.message;
                break;
            }
          } else if (error instanceof Error) {
              errorMessage = error.message;
          }

          setSaveMessage({ type: 'error', text: errorMessage });
        } else {
          // Auth succeeded but something else failed - still show success
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setSaveMessage({ type: 'success', text: 'Account updated successfully!' });
          timeoutRef.current = setTimeout(() => setSaveMessage(null), 3000);
        }
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
        // Navigate away first to trigger cleanup of listeners
        router.push('/signin');

        // Small delay to allow navigation and cleanup
        await new Promise(resolve => setTimeout(resolve, 100));

        const { signOut } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase');
        await signOut(auth);
      } catch (error) {
        // Ignore Firestore internal errors during logout - they're harmless
        if (error instanceof Error && error.message.includes('INTERNAL ASSERTION FAILED')) {
          // Still navigate to signin even if Firestore throws
          router.push('/signin');
          return;
        }
        logger.error("Error logging out", error);
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
                        <h1 className="text-8xl font-bold">{user.displayName || "User"}</h1>
                        <p className="text-neutral-400 mt-2">{user.email}</p>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AccountNavMobile activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Main Content with Sidebar */}
                <div className="flex gap-8 lg:gap-12">
                    {/* Sidebar Navigation */}
                    <AccountNav activeTab={activeTab} onTabChange={setActiveTab} />

                    {/* Tab Content */}
                    <div className="flex-1">
                        {activeTab === "account" && (
                            <div className="space-y-8">
                                {/* Subscription Status */}
                                <SubscriptionStatus />

                                {/* Student Verification Card */}
                                <Card className="bg-gradient-to-br from-[#D4FF4F]/10 to-transparent border-[#D4FF4F]/30 p-6">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <p className="text-sm text-neutral-400 mb-2">✨ SPECIAL OFFER</p>
                                        <h3 className="text-2xl font-bold text-white mb-2">Verify Your Student Status</h3>
                                        <p className="text-neutral-400 mb-4">Get 100 free credits + 25% discount on all plans</p>
                                        <p className="text-xs text-neutral-500">Upload your student ID and school details to get instant credits</p>
                                      </div>
                                      <Link href="/student-verify">
                                        <Button className="bg-[#D4FF4F] text-black hover:bg-[#D4FF4F]/90 font-semibold whitespace-nowrap">
                                          Verify Now
                                        </Button>
                                      </Link>
                                    </div>
                                </Card>

                                {/* Main Grid */}
                                <div className="grid lg:grid-cols-2 gap-8">
                                    {/* Left Column - Stats & CTA */}
                                    <div className="space-y-12">
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
                                    <Card className="bg-[#111111FF] border-neutral-800 p-8 text-center h-fit">
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

                                <Separator className="bg-neutral-800" />

                                {/* Billing History */}
                                <BillingHistory />

                                <Separator className="bg-neutral-800" />

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
                                              <Input
                                                type="password"
                                                placeholder="Enter current password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className={inputStyles}
                                              />
                                            </div>

                                            <div>
                                              <Input
                                                type="password"
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className={inputStyles}
                                              />
                                            </div>

                                            <div>
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
                                              All payments are securely processed through our trusted payment partners. Your payment information is encrypted and never stored on our servers. To update your payment method, simply use your preferred option on your next purchase.
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
                        )}

                        {activeTab === "history" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="font-semibold text-lg mb-4">History</h2>
                                    <p className="text-neutral-400 mb-6">Your created videos and generations</p>
                                </div>

                                {isLoadingHistory ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="w-full">
                                                <div className="w-80 flex-shrink-0">
                                                    <Card className="overflow-hidden rounded-2xl bg-transparent">
                                                        <AspectRatio ratio={1 / 1} className="bg-neutral-800">
                                                            <Skeleton className="w-full h-full bg-[#1C1C1C]" />
                                                        </AspectRatio>
                                                    </Card>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : history.length === 0 ? (
                                    <Card className="bg-[#1C1C1C] border-neutral-800 p-12 text-center">
                                        <p className="text-neutral-400 mb-2">No history yet</p>
                                        <p className="text-sm text-neutral-500">
                                            Start generating to see your creations
                                        </p>
                                        <Link href="/generator">
                                            <Button className="mt-4 bg-[#D4FF4F] text-black hover:bg-[#c2ef4a]">
                                                Go to Generator
                                            </Button>
                                        </Link>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {history.map(item => (
                                            <div key={item.id} className="w-full">
                                                <HistoryCard item={item} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "purchased" && (
                            <PurchasedVideos />
                        )}

                        {activeTab === "seller" && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Seller Dashboard</h2>
                                    <p className="text-neutral-400">
                                        Manage your earnings and withdrawals from marketplace sales
                                    </p>
                                </div>

                                {/* Earnings Cards */}
                                <SellerEarningsCard
                                    onWithdrawClick={(balance) => {
                                        setSellerBalance(balance);
                                        setIsWithdrawalModalOpen(true);
                                    }}
                                />

                                <Separator className="bg-neutral-800" />

                                {/* Sales History */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Sales History</h3>
                                    <SellerTransactions />
                                </div>

                                <Separator className="bg-neutral-800" />

                                {/* Withdrawal Requests */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Withdrawal Requests</h3>
                                    <PayoutRequestsTable />
                                </div>

                                {/* Seller Settings */}
                                <Separator className="bg-neutral-800" />
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Seller Settings</h3>
                                    <SellerSettingsCard />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Withdrawal Request Modal */}
            <WithdrawalRequestModal
                isOpen={isWithdrawalModalOpen}
                onClose={() => setIsWithdrawalModalOpen(false)}
                availableBalance={sellerBalance}
            />
        </div>
    );
}