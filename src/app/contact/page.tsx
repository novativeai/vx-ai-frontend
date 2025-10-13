// FILE: ./src/app/contact/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: user?.email || "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({ success: false, message: "Please fill out all required fields." });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        userId: user?.uid || null,
        submittedAt: serverTimestamp(),
      });
      
      setSubmitStatus({ success: true, message: "Thank you! Your message has been sent." });
      setFormData({ name: "", surname: "", email: user?.email || "", message: "" });

    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus({ success: false, message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const inputStyles = "bg-transparent border-0 border-b border-neutral-700 rounded-none px-0 focus-visible:ring-0 focus-visible:border-b-white transition-colors";

  return (
    <div className="bg-black text-white min-h-screen pt-32">
      <div className="container mx-auto py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-widest text-neutral-400">GET IN TOUCH</p>
            {/* THE FIX: Title is now in all caps */}
            <h1 className="text-6xl md:text-8xl font-medium tracking-tighter">
              CONTACT US
            </h1>
            <p className="text-lg text-neutral-400 max-w-md">
              Do you have any questions, suggestions, or complaints? Please contact us via the contact form or email us at <span className="text-white">info@reelzila.com</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Eg: John..."
                className={inputStyles}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="surname">Surname</Label>
              <Input
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                placeholder="Eg: Doe..."
                className={inputStyles}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Eg: johndoe@gmail.com..."
                className={inputStyles}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your message..."
                className={`${inputStyles} h-32`}
                disabled={isSubmitting}
              />
            </div>
            
            <Button
              type="submit"
              size="lg"
              variant="brand-lime"
              className="w-full text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Submit'}
            </Button>
            
            {submitStatus && (
              <div className={`mt-4 text-center p-2 rounded-md text-sm flex items-center justify-center gap-2 ${submitStatus.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {submitStatus.success && <CheckCircle className="h-4 w-4" />}
                {submitStatus.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}