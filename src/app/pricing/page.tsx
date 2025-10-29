"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    isCurrent: true, 
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
    priceId: "price_YOUR_PRO_PLAN_PRICE_ID" // IMPORTANT: Replace with actual PayTrust price ID
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
    priceId: "price_YOUR_TEAM_PLAN_PRICE_ID" // IMPORTANT: Replace with actual PayTrust price ID
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [customAmount, setCustomAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processPurchase = async (details: { customAmount?: number; priceId?: string }) => {
    if (!user) {
      router.push('/signin');
      return;
    }

    const isSubscription = !!details.priceId;
    const loadingKey = isSubscription ? details.priceId! : 'custom';
    setIsProcessing(loadingKey);
    setError(null);

    const endpoint = isSubscription ? '/create-subscription' : '/create-payment';
    const body = isSubscription 
      ? JSON.stringify({ userId: user.uid, priceId: details.priceId })
      : JSON.stringify({ userId: user.uid, customAmount: details.customAmount });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to initiate payment");
      }

      const data = await response.json();

      if (data.paymentUrl) {
        // Redirect to PayTrust payment page
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Payment URL not received from server");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setError(`Could not initiate payment: ${(error as Error).message}`);
      setIsProcessing(null);
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setCustomAmount(value);
    } else if (e.target.value === '') {
      setCustomAmount(0);
    }
  };

  const isValidCustomAmount = customAmount > 0 && customAmount <= 1000; // Max €1000

  const inputStyles = "bg-transparent border-0 border-b border-neutral-700 rounded-none px-0 text-xl h-12 focus-visible:ring-0 focus-visible:border-b-white";

  return (
    <div className="bg-black text-white min-h-screen pt-32 w-full">
      <div className="w-full md:px-28 px-4 py-16  py-16 md:py-24">
        {/* Header */}
        <div className="text-center mx-auto mb-16">
          <h1 className="text-7xl md:text-8xl font-extrabold tracking-tighter">Get more done</h1>
          <p className="mt-4 text-lg text-neutral-400">Choose the plan that fits your creative needs.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="w-full px-4 mt-8">
            <Alert variant="destructive" className="bg-red-900/20 border-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4 mt-16">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={cn(
                "flex flex-col bg-[#1C1C1C] border-neutral-800", 
                { "border-2 border-[#D4FF4F] relative": tier.isFeatured }
              )}
            >
              {tier.isFeatured && (
                <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4FF4F] text-black">
                  <Star className="h-4 w-4 mr-1" /> Best Value
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
                    tier.isFeatured 
                      ? "bg-[#D4FF4F] text-black hover:bg-[#c2ef4a]" 
                      : "bg-white text-black hover:bg-neutral-200"
                  )} 
                  disabled={tier.isCurrent || isProcessing === tier.priceId || !tier.priceId}
                  onClick={() => tier.priceId && processPurchase({ priceId: tier.priceId })}
                >
                  {isProcessing === tier.priceId ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : tier.isCurrent ? (
                    "Current Plan"
                  ) : (
                    "Upgrade"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Custom Amount Section */}
        <div className="mt-24 w-full px-4">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
            <h2 className="text-7xl md:text-8xl font-extrabold tracking-tighter mb-4 md:mb-0">
              Custom amount
            </h2>
            
            <div className="flex flex-wrap items-center gap-4">
              <Input 
                type="number" 
                value={customAmount || ''} 
                onChange={handleCustomAmountChange}
                placeholder="eg: 10$" 
                className={`${inputStyles} w-32`}
                min="1"
              />
              <p className="text-2xl text-neutral-400">x 10 =</p>
              <p className="text-2xl font-bold">{customAmount * 10} credits</p>
              <Button 
                variant="brand-outline" 
                className="bg-white text-black hover:bg-neutral-200 font-semibold" 
                onClick={() => processPurchase({ customAmount })} 
                disabled={isProcessing === 'custom' || customAmount <= 0}
              >
                {isProcessing === 'custom' ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Purchase Credits"
                )}
              </Button>
            </div>
          </div>
          
          {/* Info text */}
          <p className="text-sm text-neutral-500 mt-6 text-center md:text-right">
            Purchase any amount of credits at $1 = 10 credits
          </p>
        </div>
      </div>
    </div>
  );
}