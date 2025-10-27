"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentFormPopup, BillingDetails } from "@/components/PaymentFormPopup";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const pricingTiers = [
  { name: "Starter", price: 0, description: "For individuals and small projects", features: [ "10 Welcome Credits", "Standard Generation Speed", "Access to All Models" ], isFeatured: false, isCurrent: true, },
  { name: "Creator", price: 22, description: "For frequent users and professionals", features: [ "250 Monthly Credits", "Priority Generation Queue", "Early Access to New Models", "Standard Support" ], isFeatured: true, isCurrent: false, priceId: "price_YOUR_PRO_PLAN_PRICE_ID" }, // IMPORTANT: Add your Price ID here
  { name: "Pro", price: 49, description: "For teams and power users", features: [ "1000 Monthly Credits", "Highest Priority Queue", "API Access", "Dedicated Support" ], isFeatured: false, isCurrent: false, priceId: "price_YOUR_TEAM_PLAN_PRICE_ID" }, // IMPORTANT: Add your Price ID here
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [customAmount, setCustomAmount] = useState(10);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // This state now tracks the full purchase intention
  const [purchaseRequest, setPurchaseRequest] = useState<{ plan?: string; customAmount?: number; priceId?: string }>({});

  const initiatePurchase = async (details: { plan?: string; customAmount?: number; priceId?: string }) => {
    if (!user) { router.push('/signin'); return; }
    setPurchaseRequest(details);
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().billingInfo) {
      await processRequest(details);
    } else {
      setIsPopupOpen(true);
    }
  };

  const handlePopupSubmit = async (billingDetails: BillingDetails) => {
    if (!user) return;
    setIsProcessing(true);
    const { cardNumber, expiry, cvv, ...storableInfo } = billingDetails;
    await setDoc(doc(db, "users", user.uid), { billingInfo: storableInfo }, { merge: true });
    await processRequest(purchaseRequest);
    setIsProcessing(false);
    setIsPopupOpen(false);
  };
  
  // --- THE FIX: This new function decides which endpoint to call ---
  const processRequest = async (details: { plan?: string; customAmount?: number; priceId?: string }) => {
    if (details.plan) { // This is a subscription purchase
      await processSubscription(details.priceId!);
    } else { // This is a one-time credit purchase
      await processOneTimePayment(details.customAmount!);
    }
  };

  const processOneTimePayment = async (amount: number) => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, customAmount: amount }), // Correctly sends customAmount
      });
      const data = await response.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.detail || "Failed to get payment URL from server.");
      }
    } catch (error) {
      console.error("One-time payment creation failed:", error);
      alert(`Could not initiate payment: ${(error as Error).message}`);
      setIsProcessing(false);
    }
  };
  
  const processSubscription = async (priceId: string) => {
    if (!user) return;
    setIsProcessing(true);
    try {
        // A real implementation would now use the clientSecret with Paytrust.js/Stripe.js
        // For a redirect flow, this endpoint would also return a redirect URL.
        alert("Subscription flow initiated! Note: Frontend confirmation step is not fully built. Check Paytrust dashboard for subscription object.");
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/create-subscription`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ userId: user.uid, priceId }),
        // });
        // const data = await response.json();
        // Here you would use data.clientSecret to confirm the payment on the frontend.
    } catch (error) {
        console.error("Subscription creation failed:", error);
        alert(`Could not initiate subscription: ${(error as Error).message}`);
    } finally {
        setIsProcessing(false);
    }
  };

  const inputStyles = "bg-transparent border-0 border-b border-neutral-700 rounded-none px-0 text-xl h-12 focus-visible:ring-0 focus-visible:border-b-white";

  return (
    <>
      <PaymentFormPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        onSubmit={handlePopupSubmit}
        isProcessing={isProcessing}
      />
      <div className="bg-black text-white min-h-screen pt-32">
        <div className="container mx-auto py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-7xl md:text-8xl font-extrabold tracking-tighter">Get more done</h1>
            <p className="mt-4 text-lg text-neutral-400">Choose the plan that fits your creative needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className={cn("flex flex-col bg-[#1C1C1C] border-neutral-800", { "border-2 border-[#D4FF4F] relative": tier.isFeatured })}>
                {tier.isFeatured && <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4FF4F] text-black"><Star className="h-4 w-4" /> Best Value</Badge>}
                <CardHeader><CardTitle className="text-2xl font-bold">{tier.name}</CardTitle><CardDescription className="text-neutral-400">{tier.description}</CardDescription></CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <div className="text-6xl font-bold my-4">${tier.price}<span className="text-lg font-normal text-neutral-500">/mo</span></div>
                  <ul className="space-y-3 text-sm text-neutral-300">
                    {tier.features.map((feature, index) => (<li key={index} className="flex items-center"><Check className="h-4 w-4 mr-2 text-[#D4FF4F]" /><span>{feature}</span></li>))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className={cn("w-full font-semibold", tier.isFeatured ? "bg-[#D4FF4F] text-black hover:bg-[#c2ef4a]" : "bg-white text-black hover:bg-neutral-200")} disabled={tier.isCurrent} onClick={() => initiatePurchase({ plan: tier.name, priceId: tier.priceId })}>
                    {tier.isCurrent ? "Current Plan" : "Upgrade"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-24">
            <div className="flex flex-col md:flex-row justify-between md:items-end">
              <h2 className="text-7xl md:text-8xl font-extrabold tracking-tighter mb-4 md:mb-0">Custom amount</h2>
              <div className="flex items-center gap-4">
                  <Input type="number" value={customAmount} onChange={(e) => setCustomAmount(parseInt(e.target.value))} placeholder="eg: 10$" className={`${inputStyles} w-32`} />
                  <p className="text-2xl text-neutral-400">x 10 =</p>
                  <p className="text-2xl font-bold">{customAmount * 10} credits</p>
                  <Button variant="outline" className="bg-white text-black hover:bg-neutral-200 font-semibold" onClick={() => initiatePurchase({ customAmount })}>Purchase Credit</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}