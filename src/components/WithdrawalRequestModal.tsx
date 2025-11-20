"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X, Loader2 } from "lucide-react";

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingBalance: number;
  onSuccess?: () => void;
}

export function WithdrawalRequestModal({
  isOpen,
  onClose,
  pendingBalance,
  onSuccess,
}: WithdrawalRequestModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState(pendingBalance.toFixed(2));
  const [paypalEmail, setPaypalEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");

  // Load saved PayPal email from seller profile
  const loadSellerProfile = async () => {
    if (!user) return;
    try {
      const profileRef = doc(db, "users", user.uid, "seller_profile", "paypal");
      const profileDoc = await getDoc(profileRef);
      if (profileDoc.exists()) {
        setSavedEmail(profileDoc.data().paypalEmail || "");
      }
    } catch (error) {
      console.error("Error loading seller profile:", error);
    }
  };

  if (!isOpen) return null;

  const handleOpen = () => {
    setAmount(pendingBalance.toFixed(2));
    setPaypalEmail("");
    setMessage(null);
    loadSellerProfile();
  };

  if (isOpen && !savedEmail && paypalEmail === "") {
    handleOpen();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const withdrawAmount = parseFloat(amount);

    // Validation
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return;
    }

    if (withdrawAmount > pendingBalance) {
      setMessage({ type: "error", text: "Amount exceeds your pending balance" });
      return;
    }

    if (!paypalEmail || paypalEmail.trim() === "") {
      setMessage({ type: "error", text: "Please enter your PayPal email" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paypalEmail)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    try {
      // Create payout request in Firestore
      const payoutRequestsRef = collection(db, "users", user.uid, "payout_requests");
      const docRef = await addDoc(payoutRequestsRef, {
        amount: withdrawAmount,
        paypalEmail: paypalEmail.toLowerCase().trim(),
        status: "pending",
        createdAt: new Date(),
      });

      // Send email notification to admin
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const notificationResponse = await fetch(`${backendUrl}/seller/withdrawal-request-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({
            requestId: docRef.id,
            amount: withdrawAmount,
            paypalEmail: paypalEmail.toLowerCase().trim(),
          }),
        });

        if (!notificationResponse.ok) {
          console.warn('Failed to send withdrawal notification email');
        }
      } catch (emailError) {
        // Don't fail the whole request if email fails
        console.error('Error sending withdrawal notification:', emailError);
      }

      setMessage({
        type: "success",
        text: `Withdrawal request submitted! We&apos;ll process your €${withdrawAmount.toFixed(2)} transfer within 24-48 hours.`,
      });

      // Reset form
      setAmount(pendingBalance.toFixed(2));
      setPaypalEmail("");

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      setMessage({ type: "error", text: "Failed to submit withdrawal request. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const amountValue = parseFloat(amount) || 0;
  const isValidAmount = amountValue > 0 && amountValue <= pendingBalance;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <Card className="bg-black border-neutral-700 p-8 w-full max-w-md shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Request Withdrawal</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Available Balance */}
            <div>
              <label className="text-sm text-neutral-400 block mb-2">Available Balance</label>
              <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-[#D4FF4F]">€{pendingBalance.toFixed(2)}</p>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="text-sm text-neutral-400 block mb-2">Withdrawal Amount (€)</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max={pendingBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-neutral-900 border-neutral-700 text-white"
                placeholder="0.00"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Maximum: €{pendingBalance.toFixed(2)}
              </p>
            </div>

            {/* PayPal Email Input */}
            <div>
              <label className="text-sm text-neutral-400 block mb-2">PayPal Email Address</label>
              <Input
                type="email"
                value={paypalEmail || savedEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="bg-neutral-900 border-neutral-700 text-white"
                placeholder="your-paypal@email.com"
              />
              {savedEmail && !paypalEmail && (
                <p className="text-xs text-neutral-500 mt-1">
                  Using saved email: {savedEmail}
                </p>
              )}
            </div>

            {/* Info Message */}
            <Alert className="bg-blue-900/20 border-blue-700/50">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300 text-sm">
                We&apos;ll transfer your withdrawal to the PayPal account within 24-48 hours.
              </AlertDescription>
            </Alert>

            {/* Messages */}
            {message && (
              <Alert
                className={
                  message.type === "success"
                    ? "bg-green-900/20 border-green-700"
                    : "bg-red-900/20 border-red-700"
                }
              >
                <AlertDescription
                  className={message.type === "success" ? "text-green-400" : "text-red-400"}
                >
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
                className="flex-1 border-neutral-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValidAmount || loading || !paypalEmail.trim()}
                className="flex-1 bg-[#D4FF4F] text-black hover:bg-[#c2ef4a] font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  `Request €${amountValue.toFixed(2)}`
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
