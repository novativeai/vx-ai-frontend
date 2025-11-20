"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

interface SellerProfile {
  paypalEmail?: string;
  status?: "unverified" | "verified" | "suspended" | "banned";
}

export function SellerSettingsCard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Set up real-time listener for seller profile
    const profileRef = doc(db, "users", user.uid, "seller_profile", "profile");
    const unsub = onSnapshot(
      profileRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as SellerProfile;
          setProfile(data);
          setPaypalEmail(data.paypalEmail || "");
        } else {
          setProfile({});
          setPaypalEmail("");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching seller profile:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSave = async () => {
    if (!user) return;

    // Validate email
    if (paypalEmail && !validateEmail(paypalEmail)) {
      setMessage({ type: "error", text: "Please enter a valid PayPal email address" });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          paypalEmail: paypalEmail || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to update profile");
      }

      setMessage({ type: "success", text: "PayPal email updated successfully!" });
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update PayPal email";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setPaypalEmail(profile?.paypalEmail || "");
    setIsEditing(false);
    setMessage(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 bg-neutral-800" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-neutral-900 border-neutral-800 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold">PayPal Account</h3>
        </div>

        {/* Messages */}
        {message && (
          <Alert className={`mb-4 ${message.type === "success" ? "bg-green-900/20 border-green-700" : "bg-red-900/20 border-red-700"}`}>
            <div className="flex gap-2">
              {message.type === "success" ? (
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <AlertDescription className={message.type === "success" ? "text-green-400" : "text-red-400"}>
                {message.text}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Display Mode */}
        {!isEditing ? (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-neutral-400 mb-1">PayPal Email Address</p>
              {paypalEmail ? (
                <p className="text-white font-medium">{paypalEmail}</p>
              ) : (
                <p className="text-neutral-500 italic">No PayPal email configured yet</p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {paypalEmail ? "Update Email" : "Add PayPal Email"}
              </Button>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-4">
            <div>
              <label className="text-sm text-neutral-400 mb-2 block">PayPal Email Address</label>
              <Input
                type="email"
                placeholder="your-paypal@email.com"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              />
              <p className="text-xs text-neutral-500 mt-2">
                This is the PayPal account where your payouts will be sent
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving || !paypalEmail}
                className="bg-green-600 hover:bg-green-700 text-white font-medium flex-1"
              >
                {isSaving ? "Saving..." : "Save Email"}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isSaving}
                variant="outline"
                className="border-neutral-700 text-neutral-300 hover:text-white flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <p className="text-sm text-blue-300">
            💡 <strong>Tip:</strong> Make sure your PayPal email matches the account where you want to receive payouts. This cannot be changed once a payout is submitted.
          </p>
        </div>
      </Card>
    </div>
  );
}
