"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils"; // Make sure you have this utility from Shadcn
import { PaymentFormPopup, BillingDetails } from "@/components/PaymentFormPopup";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

// The data structure for the 3-tier pricing cards
const pricingTiers = [
  {
    name: "Starter",
    price: 0,
    description: "For individuals and small projects",
    features: [
      "10 Welcome Credits",
      "Standard Generation Speed",
      "Access to All Models"
    ],
    isFeatured: false,
    isCurrent: true, // To disable the button
  },
  {
    name: "Creator",
    price: 22,
    description: "For frequent users and professionals",
    features: [
      "250 Monthly Credits",
      "Priority Generation Queue",
      "Early Access to New Models",
      "Standard Support"
    ],
    isFeatured: true,
    isCurrent: false,
  },
  {
    name: "Pro",
    price: 49,
    description: "For teams and power users",
    features: [
      "1000 Monthly Credits",
      "Highest Priority Queue",
      "API Access",
      "Dedicated Support"
    ],
    isFeatured: false,
    isCurrent: false,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [customAmount, setCustomAmount] = useState(10);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseRequest, setPurchaseRequest] = useState<{ plan?: string; customAmount?: number }>({});

  const initiatePurchase = async (details: { plan?: string; customAmount?: number }) => {
    if (!user) {
      router.push('/signin');
      return;
    }
    setPurchaseRequest(details);
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().billingInfo) {
      processPayment(details);
    } else {
      setIsPopupOpen(true);
    }
  };

  const handlePopupSubmit = async (billingDetails: BillingDetails) => {
    if (!user) return;
    setIsProcessing(true);
    const { cardNumber, expiry, cvv, ...storableInfo } = billingDetails;
    await setDoc(doc(db, "users", user.uid), { billingInfo: storableInfo }, { merge: true });
    await processPayment(purchaseRequest);
    setIsProcessing(false);
    setIsPopupOpen(false);
  };

  const processPayment = async (details: { plan?: string; customAmount?: number }) => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, ...details }),
      });
      const data = await response.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Failed to get payment URL from server.");
      }
    } catch (error) {
      console.error("Payment creation failed:", error);
      alert("Could not initiate payment. Please try again.");
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
            <p className="mt-4 text-lg text-neutral-400">
              Choose the plan that fits your creative needs. Get more value and priority with a subscription.
            </p>
          </div>

          {/* --- REVERTED 3-TIER PRICING CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={cn(
                  "flex flex-col bg-[#1C1C1C] border-neutral-800 transition-transform transform hover:scale-105",
                  { "border-2 border-[#D4FF4F] shadow-xl relative": tier.isFeatured }
                )}
              >
                {tier.isFeatured && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#D4FF4F] text-black">
                      <Star className="h-4 w-4" />
                      Best Value
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <CardDescription className="text-neutral-400">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <div className="text-6xl font-bold my-4">
                    ${tier.price}
                    <span className="text-lg font-normal text-neutral-500">/mo</span>
                  </div>
                  <ul className="space-y-3 text-sm text-neutral-300">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-[#D4FF4F] flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                      className={cn(
                        "w-full font-semibold",
                        tier.isFeatured ? "bg-[#D4FF4F] text-black hover:bg-[#c2ef4a]" : "bg-white text-black hover:bg-neutral-200"
                      )}
                      disabled={tier.isCurrent}
                      onClick={() => initiatePurchase({ plan: tier.name })}
                  >
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