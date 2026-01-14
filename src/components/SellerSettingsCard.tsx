"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, CheckCircle, AlertCircle, Shield } from "lucide-react";
import { logger } from "@/lib/logger";

interface BankDetails {
  iban?: string;
  accountHolder?: string;
  bankName?: string;
  bic?: string;
}

// IBAN validation - basic format check
function validateIBAN(iban: string): { valid: boolean; error?: string } {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();

  if (!cleaned) {
    return { valid: false, error: "IBAN is required" };
  }

  if (cleaned.length < 15 || cleaned.length > 34) {
    return { valid: false, error: "IBAN must be between 15 and 34 characters" };
  }

  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleaned)) {
    return { valid: false, error: "Invalid IBAN format. Must start with country code (e.g., DE, FR, ES)" };
  }

  return { valid: true };
}

// Format IBAN with spaces for display
function formatIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
}

// Mask IBAN for security (show only last 4 characters)
function maskIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, '');
  if (cleaned.length <= 4) return cleaned;
  return '•••• •••• •••• ' + cleaned.slice(-4);
}

export function SellerSettingsCard() {
  const { user } = useAuth();
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    iban: "",
    accountHolder: "",
    bankName: "",
    bic: ""
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const profileRef = doc(db, "users", user.uid, "seller_profile", "bank_details");
    const unsub = onSnapshot(
      profileRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as BankDetails;
          setBankDetails(data);
          setFormData({
            iban: data.iban || "",
            accountHolder: data.accountHolder || "",
            bankName: data.bankName || "",
            bic: data.bic || ""
          });
        } else {
          setBankDetails({});
        }
        setLoading(false);
      },
      (error) => {
        logger.error("Error fetching bank details", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate IBAN
    const ibanResult = validateIBAN(formData.iban);
    if (!ibanResult.valid) {
      errors.iban = ibanResult.error || "Invalid IBAN";
    }

    // Validate account holder
    if (!formData.accountHolder.trim()) {
      errors.accountHolder = "Account holder name is required";
    } else if (formData.accountHolder.trim().length < 2) {
      errors.accountHolder = "Account holder name must be at least 2 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!user) return;

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const profileRef = doc(db, "users", user.uid, "seller_profile", "bank_details");
      await setDoc(profileRef, {
        iban: formData.iban.replace(/\s/g, '').toUpperCase(),
        accountHolder: formData.accountHolder.trim(),
        bankName: formData.bankName.trim() || null,
        bic: formData.bic.replace(/\s/g, '').toUpperCase() || null,
        updatedAt: new Date()
      });

      setMessage({ type: "success", text: "Bank details saved successfully!" });
      setIsEditing(false);
      timeoutRef.current = setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      logger.error("Error saving bank details", error);
      setMessage({ type: "error", text: "Failed to save bank details. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      iban: bankDetails?.iban || "",
      accountHolder: bankDetails?.accountHolder || "",
      bankName: bankDetails?.bankName || "",
      bic: bankDetails?.bic || ""
    });
    setFieldErrors({});
    setIsEditing(false);
    setMessage(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 bg-neutral-800" />
      </div>
    );
  }

  const hasBankDetails = bankDetails?.iban && bankDetails?.accountHolder;

  return (
    <div className="space-y-4">
      <Card className="bg-neutral-900 border-neutral-800 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold">Bank Account for Payouts</h3>
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
          <div className="space-y-4">
            {hasBankDetails ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Account Holder</p>
                    <p className="text-white font-medium">{bankDetails.accountHolder}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">IBAN</p>
                    <p className="text-white font-mono">{maskIBAN(bankDetails.iban || "")}</p>
                  </div>
                  {bankDetails.bankName && (
                    <div>
                      <p className="text-sm text-neutral-400 mb-1">Bank Name</p>
                      <p className="text-white">{bankDetails.bankName}</p>
                    </div>
                  )}
                  {bankDetails.bic && (
                    <div>
                      <p className="text-sm text-neutral-400 mb-1">BIC/SWIFT</p>
                      <p className="text-white font-mono">{bankDetails.bic}</p>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-neutral-700 text-neutral-300 hover:text-white"
                >
                  Update Bank Details
                </Button>
              </>
            ) : (
              <div className="text-center py-6">
                <Building2 className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-300 font-medium mb-2">No bank account configured</p>
                <p className="text-sm text-neutral-500 mb-4">
                  Add your bank details to receive payouts
                </p>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Bank Account
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-4">
            {/* Account Holder */}
            <div>
              <label className="text-sm text-neutral-400 mb-2 block">
                Account Holder Name <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                value={formData.accountHolder}
                onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                className={`bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 ${fieldErrors.accountHolder ? 'border-red-500' : ''}`}
              />
              {fieldErrors.accountHolder && (
                <p className="text-xs text-red-400 mt-1">{fieldErrors.accountHolder}</p>
              )}
            </div>

            {/* IBAN */}
            <div>
              <label className="text-sm text-neutral-400 mb-2 block">
                IBAN <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                placeholder="DE89 3704 0044 0532 0130 00"
                value={formData.iban}
                onChange={(e) => setFormData({ ...formData, iban: formatIBAN(e.target.value) })}
                className={`bg-neutral-800 border-neutral-700 text-white font-mono placeholder:text-neutral-500 ${fieldErrors.iban ? 'border-red-500' : ''}`}
              />
              {fieldErrors.iban && (
                <p className="text-xs text-red-400 mt-1">{fieldErrors.iban}</p>
              )}
              <p className="text-xs text-neutral-500 mt-1">
                Your International Bank Account Number
              </p>
            </div>

            {/* Bank Name (Optional) */}
            <div>
              <label className="text-sm text-neutral-400 mb-2 block">
                Bank Name <span className="text-neutral-500">(Optional)</span>
              </label>
              <Input
                type="text"
                placeholder="Deutsche Bank"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              />
            </div>

            {/* BIC/SWIFT (Optional) */}
            <div>
              <label className="text-sm text-neutral-400 mb-2 block">
                BIC/SWIFT Code <span className="text-neutral-500">(Optional)</span>
              </label>
              <Input
                type="text"
                placeholder="DEUTDEDB"
                value={formData.bic}
                onChange={(e) => setFormData({ ...formData, bic: e.target.value.toUpperCase() })}
                className="bg-neutral-800 border-neutral-700 text-white font-mono placeholder:text-neutral-500"
                maxLength={11}
              />
              <p className="text-xs text-neutral-500 mt-1">
                8 or 11 character bank identifier code
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white font-medium flex-1"
              >
                {isSaving ? "Saving..." : "Save Bank Details"}
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

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-300 font-medium mb-1">Your data is secure</p>
              <p className="text-xs text-blue-200/70">
                Bank details are encrypted and only used for payout transfers. We never share your financial information with third parties.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
