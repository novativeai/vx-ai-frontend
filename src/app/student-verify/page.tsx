"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Upload, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function StudentVerifyPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [studentCardFile, setStudentCardFile] = useState<File | null>(null);
  const [cardPreview, setCardPreview] = useState<string | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    schoolName: "",
    schoolCountry: "",
    schoolEmail: "",
    graduationYear: new Date().getFullYear() + 4,
  });

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-neutral-400 mb-8">
            You need to be logged in to verify as a student.
          </p>
          <Link href="/signin">
            <Button className="bg-[#D4FF4F] text-black hover:bg-[#D4FF4F]/90">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (JPG, PNG, etc.)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setStudentCardFile(file);
      setError(null);

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "graduationYear" ? parseInt(value) || new Date().getFullYear() : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      // Validation
      if (!studentCardFile) {
        throw new Error("Please upload your student card");
      }

      if (!formData.schoolName.trim()) {
        throw new Error("Please enter your school name");
      }

      if (!formData.schoolCountry.trim()) {
        throw new Error("Please select your school country");
      }

      if (
        formData.graduationYear &&
        formData.graduationYear < new Date().getFullYear()
      ) {
        throw new Error("Graduation year must be in the future");
      }

      // CHECK: If verification already exists
      const studentVerificationRef = doc(
        db,
        "users",
        user.uid,
        "studentVerification",
        "profile"
      );

      const existingVerification = await getDoc(studentVerificationRef);
      if (existingVerification.exists()) {
        setError('You have already submitted a verification request. Please wait for admin approval.');
        setIsSubmitting(false);
        return;
      }

      // Upload student card to Firebase Storage
      const storage = getStorage();
      const fileRef = ref(
        storage,
        `student-verifications/${user.uid}/student-card-${Date.now()}`
      );

      await uploadBytes(fileRef, studentCardFile);
      const downloadURL = await getDownloadURL(fileRef);

      // Save student verification to Firestore
      const userDocRef = doc(db, "users", user.uid);

      // Create student verification document with pending status
      // DO NOT grant credits until admin approves
      await setDoc(studentVerificationRef, {
        isAStudent: false, // Will be set to true after admin approval
        studentCardUrl: downloadURL,
        schoolName: formData.schoolName,
        schoolCountry: formData.schoolCountry,
        schoolEmail: formData.schoolEmail || null,
        graduationYear: formData.graduationYear || null,
        verificationStatus: "pending", // Pending admin approval
        createdAt: new Date(),
      });

      // Update user document but DON'T add credits yet
      await updateDoc(userDocRef, {
        isAStudent: false, // Only true after verification
        studentVerificationPending: true,
      });

      setSuccess(true);
      setStudentCardFile(null);
      setCardPreview(null);
      setFormData({
        schoolName: "",
        schoolCountry: "",
        schoolEmail: "",
        graduationYear: new Date().getFullYear() + 4,
      });

      // Redirect to account page after 3 seconds with cleanup
      timeoutRef.current = setTimeout(() => {
        router.push("/account");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify student");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">
            Student Verification
          </h1>
          <p className="text-neutral-400 text-lg">
            Submit your student verification to receive 100 free credits after admin approval. All you need
            is a valid student ID or enrollment document.
          </p>
        </div>

        {/* Benefits Card */}
        <Card className="bg-gradient-to-br from-[#D4FF4F]/10 to-transparent border-[#D4FF4F]/30 p-6 mb-12">
          <h3 className="text-lg font-semibold text-[#D4FF4F] mb-4">
            Student Benefits
          </h3>
          <ul className="space-y-2 text-neutral-300">
            <li>✓ 100 free credits after verification</li>
            <li>✓ 25% discount on all subscription plans</li>
            <li>✓ Early access to new features</li>
            <li>✓ Student-exclusive content library</li>
          </ul>
        </Card>

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-start gap-3">
            <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-200">
                Verification Submitted!
              </p>
              <p className="text-sm text-green-100 mt-1">
                Your verification request has been submitted successfully.
                An admin will review your submission within 24-48 hours.
                You will receive 100 free credits once approved.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-200">Error</p>
              <p className="text-sm text-red-100 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <Card className="bg-neutral-900/50 border-neutral-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Card Upload */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Student Card/ID *
              </label>
              <div className="relative border-2 border-dashed border-neutral-700 rounded-lg p-8 hover:border-[#D4FF4F]/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCardFileChange}
                  disabled={isSubmitting}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                {cardPreview ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-full max-w-xs h-48 mb-4">
                      <Image
                        src={cardPreview}
                        alt="Student card preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-neutral-400">
                      Click to change the image
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload size={32} className="text-neutral-500 mb-2" />
                    <p className="font-medium">Upload your student card</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      PNG, JPG or GIF (max 5MB)
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Your student ID should clearly show your name, school, and
                enrollment period.
              </p>
            </div>

            {/* School Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                School/University Name *
              </label>
              <Input
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                placeholder="e.g., MIT, Stanford University"
                className="bg-neutral-800/50 border-neutral-700 text-white"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* School Country */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Country *
              </label>
              <select
                name="schoolCountry"
                value={formData.schoolCountry}
                onChange={handleInputChange}
                className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neutral-600"
                disabled={isSubmitting}
                required
              >
                <option value="">Select your country</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Spain">Spain</option>
                <option value="Italy">Italy</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Japan">Japan</option>
                <option value="India">India</option>
                <option value="China">China</option>
                <option value="Brazil">Brazil</option>
                <option value="Mexico">Mexico</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* School Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                School Email Address
              </label>
              <Input
                name="schoolEmail"
                type="email"
                value={formData.schoolEmail}
                onChange={handleInputChange}
                placeholder="e.g., student@university.edu"
                className="bg-neutral-800/50 border-neutral-700 text-white"
                disabled={isSubmitting}
              />
              <p className="text-xs text-neutral-500 mt-2">
                Optional: Your school email helps us verify your enrollment
              </p>
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Expected Graduation Year
              </label>
              <select
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleInputChange}
                className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neutral-600"
                disabled={isSubmitting}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-800 my-4" />

            {/* Terms */}
            <div className="flex items-start gap-3 p-4 bg-neutral-800/30 rounded-lg">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 rounded"
              />
              <label htmlFor="terms" className="text-sm text-neutral-400">
                I confirm that all information provided is accurate and my
                student status is current. I understand that providing false
                information may result in account suspension.
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !studentCardFile}
              className="w-full bg-[#D4FF4F] hover:bg-[#D4FF4F]/90 text-black font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify My Student Status"
              )}
            </Button>
          </form>
        </Card>

        {/* Help Text */}
        <div className="mt-12 p-6 bg-neutral-900/50 rounded-lg border border-neutral-800">
          <h3 className="font-semibold mb-3">Need Help?</h3>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>
              • Make sure your student ID/card is clearly visible and readable
            </li>
            <li>
              • The document should show your name, school, and enrollment dates
            </li>
            <li>
              • Verification is typically completed within 24-48 hours
            </li>
            <li>
              • Questions? Contact us at support@reelzila.com
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
