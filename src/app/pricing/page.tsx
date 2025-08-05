"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Define the structure for a pricing tier
const pricingTiers = [
  {
    name: "Starter",
    credits: 50,
    price: 10,
    pricePerCredit: 0.20,
    features: [
      "Perfect for trying things out",
      "Generate up to 50 videos",
      "Standard support"
    ],
    isFeatured: false,
  },
  {
    name: "Creator",
    credits: 150,
    price: 25,
    pricePerCredit: 0.16,
    features: [
      "Ideal for regular users",
      "Generate up to 150 videos",
      "Priority support",
      "Early access to new features"
    ],
    isFeatured: true,
  },
  {
    name: "Pro",
    credits: 500,
    price: 75,
    pricePerCredit: 0.15,
    features: [
      "For power users and professionals",
      "Generate up to 500 videos",
      "Dedicated 24/7 support",
      "API access"
    ],
    isFeatured: false,
  },
];

export default function PricingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const handlePurchase = (tierName: string) => {
        if (!user) {
            router.push('/signin');
            return;
        }
        // This is where you would integrate with a payment provider like Stripe.
        // For now, we'll just log to the console.
        console.log(`User ${user.uid} is attempting to purchase the ${tierName} package.`);
        alert(`Payment integration for the ${tierName} package would start here!`);
    };

    if (loading) {
        return <div>Loading...</div>; // You can add a skeleton loader here
    }

  return (
    <div className="flex flex-col items-center bg-gray-50/50 dark:bg-gray-900/50 min-h-screen py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Find the Perfect Plan</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the credit package that fits your creative needs. Get more value with larger packs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "flex flex-col transition-transform transform hover:scale-105",
                { "border-2 border-primary shadow-xl relative": tier.isFeatured }
              )}
            >
              {tier.isFeatured && (
                <Badge variant="default" className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Best Value
                </Badge>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                <CardDescription>
                    ${tier.pricePerCredit.toFixed(2)} / credit
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow flex flex-col items-center">
                <div className="text-5xl font-bold my-4">
                  ${tier.price}
                  <span className="text-lg font-normal text-muted-foreground">/ one-time</span>
                </div>
                <p className="font-semibold text-primary mb-6">{tier.credits} Credits</p>
                <ul className="space-y-3 text-sm text-muted-foreground text-left w-full">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                    className="w-full" 
                    variant={tier.isFeatured ? "default" : "outline"}
                    onClick={() => handlePurchase(tier.name)}
                >
                  Purchase {tier.name}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
                All purchases are final. Credits do not expire. Need a custom plan? <a href="#" className="underline">Contact us</a>.
            </p>
        </div>
      </div>
    </div>
  );
}