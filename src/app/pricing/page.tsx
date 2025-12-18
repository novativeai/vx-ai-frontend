"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";
import { toast } from "@/hooks/use-toast";

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [customAmount, setCustomAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  const processPurchase = async (amount: number) => {
    if (!user) {
      router.push('/signin');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, customAmount: amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to initiate payment");
      }

      const data = await response.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Payment URL not received from server");
      }
    } catch (error) {
      logger.error("Payment initiation failed", error);
      toast.error("Payment failed", `Could not initiate payment: ${(error as Error).message}`);
      setIsProcessing(false);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setCustomAmount(value[0]);
  };

  const presetAmounts = [10, 25, 50, 100, 250];

  // Calculate what credits can generate
  const credits = customAmount * 10;
  const estimatedVideos = Math.floor(credits / 15);
  const estimatedImages = Math.floor(credits / 3);

  return (
    <div className="bg-black text-white min-h-screen pt-8 md:pt-16 w-full">
      <div className="w-full md:px-28 px-4 py-8 md:py-16">
        {/* Header - Brand Style */}
        <div className="text-center mx-auto mb-16">
          <p className="text-sm uppercase tracking-widest text-neutral-400">Pay as you go</p>
          <h1 className="text-5xl md:text-7xl font-regular tracking-tighter mt-2">
            CREDITS
          </h1>
          <p className="mt-4 text-lg text-neutral-300 max-w-xl mx-auto">
            Purchase credits and use them whenever you want. No subscriptions, no commitments, no expiration.
          </p>
        </div>

        {/* Main Credit Purchase Card */}
        <div className="bg-[#0A0A0A] border border-neutral-900 rounded-2xl overflow-hidden max-w-4xl mx-auto">
          <div className="p-8 md:p-16">
            {/* Credits Display */}
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-neutral-500 mb-4">You will receive</p>
              <div className="text-8xl md:text-[10rem] font-regular tracking-tighter text-white leading-none">
                {credits}
              </div>
              <p className="text-xl text-neutral-500 mt-4 uppercase tracking-wider">credits</p>
            </div>

            {/* Estimation - Clean Text Only */}
            <div className="flex justify-center gap-12 md:gap-20 mb-14">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-regular text-white tracking-tight">{estimatedVideos}</div>
                <div className="text-sm text-neutral-500 uppercase tracking-wider mt-1">videos approx.</div>
              </div>
              <div className="w-px bg-neutral-800" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-regular text-white tracking-tight">{estimatedImages}</div>
                <div className="text-sm text-neutral-500 uppercase tracking-wider mt-1">images approx.</div>
              </div>
            </div>

            {/* Slider - Thinner Premium Style */}
            <div className="max-w-2xl mx-auto mb-10">
              <Slider
                value={[customAmount]}
                onValueChange={handleSliderChange}
                min={10}
                max={1500}
                step={1}
                className="w-full [&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:bg-neutral-800 [&_[data-slot=slider-range]]:bg-[#D4FF4F] [&_[data-slot=slider-thumb]]:h-4 [&_[data-slot=slider-thumb]]:w-4 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-[#D4FF4F] [&_[data-slot=slider-thumb]]:bg-black"
              />
              <div className="flex justify-between mt-4 text-xs text-neutral-600 uppercase tracking-wider">
                <span>€10</span>
                <span>€1500</span>
              </div>
            </div>

            {/* Preset Amounts */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {presetAmounts.map((amount) => (
                <Button
                  key={amount}
                  onClick={() => setCustomAmount(amount)}
                  variant={customAmount === amount ? "brand-lime" : "outline"}
                  className={cn(
                    "min-w-[80px] font-medium",
                    customAmount === amount
                      ? ""
                      : "border-neutral-800 bg-transparent text-neutral-400 hover:bg-neutral-900 hover:text-white hover:border-neutral-700"
                  )}
                >
                  €{amount}
                </Button>
              ))}
            </div>

            {/* Price and Purchase */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="text-center sm:text-left">
                <p className="text-xs text-neutral-600 uppercase tracking-widest">Total</p>
                <div className="text-5xl font-regular text-white tracking-tight">€{customAmount}</div>
              </div>
              <Button
                size="lg"
                variant="brand-lime"
                className="px-12 text-base font-medium"
                onClick={() => processPurchase(customAmount)}
                disabled={isProcessing || customAmount <= 0}
              >
                {isProcessing ? "Processing..." : "Purchase Credits"}
              </Button>
            </div>
          </div>
        </div>

        {/* Info Section - Clean Text Only */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-white mb-2">No Expiration</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">Your credits never expire. Use them whenever inspiration strikes.</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-white mb-2">All Models Included</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">Access every AI model with your credits. No restrictions.</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-white mb-2">Instant Access</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">Credits are added immediately after purchase. Start creating right away.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
