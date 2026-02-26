"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Building2, CheckCircle, AlertCircle, ArrowRight, Shield } from "lucide-react";
import { logger } from "@/lib/logger";
import { apiClient, ApiError } from "@/lib/apiClient";

interface BankDetails {
  iban?: string;
  accountHolder?: string;
  bankName?: string;
  bic?: string;
}

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSuccess?: () => void;
}

// Mask IBAN for security (show only last 4 characters)
function maskIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, '');
  if (cleaned.length <= 4) return cleaned;
  return '•••• •••• •••• ' + cleaned.slice(-4);
}

export function WithdrawalRequestModal({
  isOpen,
  onClose,
  availableBalance,
  onSuccess,
}: WithdrawalRequestModalProps) {
  const { user } = useAuth();
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedAmount, setSubmittedAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !user) {
      setLoading(false);
      return;
    }

    const fetchBankDetails = async () => {
      try {
        setLoading(true);
        const bankRef = doc(db, "users", user.uid, "seller_profile", "bank_details");
        const bankDoc = await getDoc(bankRef);

        if (bankDoc.exists()) {
          setBankDetails(bankDoc.data() as BankDetails);
        } else {
          setBankDetails(null);
        }
      } catch (err) {
        logger.error("Error fetching bank details", err);
        setError("Failed to load bank details");
      } finally {
        setLoading(false);
      }
    };

    fetchBankDetails();
  }, [isOpen, user]);

  const handleSubmitRequest = async () => {
    if (!user || !bankDetails?.iban || !bankDetails?.accountHolder) return;

    setSubmitting(true);
    setError(null);

    try {
      // Capture the amount before the backend call changes the balance
      const withdrawAmount = availableBalance;

      // Use backend API for secure payout request creation
      await apiClient.createPayoutRequest({
        amount: withdrawAmount,
        bankDetails: {
          iban: bankDetails.iban,
          accountHolder: bankDetails.accountHolder,
          bankName: bankDetails.bankName || undefined,
          bic: bankDetails.bic || undefined,
        },
      });

      setSubmittedAmount(withdrawAmount);
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      logger.error("Error submitting withdrawal request", err);
      if (err instanceof ApiError) {
        setError(err.detail || "Failed to submit withdrawal request. Please try again.");
      } else {
        setError("Failed to submit withdrawal request. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setSubmittedAmount(0);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const hasBankDetails = bankDetails?.iban && bankDetails?.accountHolder;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
        <Card className="bg-black border-neutral-700 p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {submitted ? "Request Submitted" : "Request Withdrawal"}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          {/* Success State */}
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Withdrawal Requested!</h3>
              <p className="text-neutral-400 mb-6">
                Your request for €{submittedAmount.toFixed(2)} has been submitted. We&apos;ll process it within 2-5 business days.
              </p>
              <Button
                onClick={handleClose}
                className="w-full bg-[#D4FF4F] text-black hover:bg-[#c2ef4a] font-semibold"
              >
                Done
              </Button>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 bg-neutral-800" />
              <Skeleton className="h-32 bg-neutral-800" />
            </div>
          ) : !hasBankDetails ? (
            /* No Bank Details State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Bank Account Required</h3>
              <p className="text-neutral-400 mb-6">
                Please set up your bank account details in the Seller Settings section before requesting a withdrawal.
              </p>
              <Button
                onClick={handleClose}
                className="w-full bg-neutral-800 text-white hover:bg-neutral-700"
              >
                Got it
              </Button>
            </div>
          ) : (
            /* Withdrawal Form */
            <>
              {/* Error Message */}
              {error && (
                <Alert className="mb-4 bg-red-900/20 border-red-700">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <AlertDescription className="text-red-400">
                      {error}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Available Balance */}
              <div className="mb-6">
                <label className="text-sm text-neutral-400 block mb-2">Withdrawal Amount</label>
                <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-700/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-[#D4FF4F]">€{availableBalance.toFixed(2)}</p>
                </div>
              </div>

              {/* Bank Details Confirmation */}
              <div className="mb-6">
                <label className="text-sm text-neutral-400 block mb-2">Transfer to</label>
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-white">{bankDetails.accountHolder}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">IBAN</span>
                      <span className="text-white font-mono">{maskIBAN(bankDetails.iban || "")}</span>
                    </div>
                    {bankDetails.bankName && (
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Bank</span>
                        <span className="text-white">{bankDetails.bankName}</span>
                      </div>
                    )}
                    {bankDetails.bic && (
                      <div className="flex justify-between">
                        <span className="text-neutral-400">BIC/SWIFT</span>
                        <span className="text-white font-mono">{bankDetails.bic}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg mb-6">
                <div className="flex gap-2">
                  <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-200/80">
                    Withdrawals are processed within 2-5 business days. You&apos;ll receive an email confirmation once the transfer is initiated.
                  </p>
                </div>
              </div>

              {/* Info */}
              <p className="text-xs text-neutral-500 text-center mb-6">
                By submitting, you confirm the bank details are correct.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 border-neutral-700 text-neutral-300 hover:text-white"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={submitting}
                  className="flex-1 bg-[#D4FF4F] text-black hover:bg-[#c2ef4a] font-semibold"
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Confirm Withdrawal
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
