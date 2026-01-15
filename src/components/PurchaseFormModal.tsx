"use client";

import React, { useState } from "react";
import { MarketplaceProduct } from "@/types/types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoWithWatermark } from "@/components/VideoWithWatermark";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

interface PurchaseFormModalProps {
  product: MarketplaceProduct;
  isOpen: boolean;
  onClose: () => void;
}

export const PurchaseFormModal: React.FC<PurchaseFormModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Sign in required", "Please sign in to purchase");
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment for marketplace purchase
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/marketplace/create-purchase-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
          body: JSON.stringify({
            userId: user.uid,
            productId: product.id,
            title: product.title,
            videoUrl: product.videoUrl,
            thumbnailUrl: product.thumbnailUrl,
            price: product.price,
            sellerName: product.sellerName,
            sellerId: product.sellerId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to initiate payment");
      }

      const data = await response.json();

      // Redirect to PayTrust checkout
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (err) {
      toast.error("Purchase failed", err instanceof Error ? err.message : "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-neutral-800 bg-neutral-900 z-10">
          <h2 className="text-2xl font-bold">Purchase Video</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Preview */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-widest text-neutral-400">Preview</h3>
              <div className="rounded-xl overflow-hidden bg-black">
                <VideoWithWatermark
                  videoUrl={product.videoUrl}
                  watermarkText="reelzila"
                  onContextMenu={e => {
                    e.preventDefault();
                    return false;
                  }}
                />
              </div>
              <p className="text-xs text-neutral-500">
                Video preview with watermark. Full video without watermark will be delivered after purchase.
              </p>
            </div>

            {/* Purchase Details */}
            <div className="space-y-6">
              {/* Product Info */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                <p className="text-neutral-400 mb-4">{product.description}</p>

                {/* Seller Info */}
                <div className="py-4 border-t border-b border-neutral-800">
                  <p className="text-sm text-neutral-400 mb-1">Seller</p>
                  <p className="font-semibold">{product.sellerName}</p>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-3">
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-neutral-400 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-neutral-800 text-neutral-200 px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.useCases && product.useCases.length > 0 && (
                  <div>
                    <p className="text-sm text-neutral-400 mb-2">Use Cases</p>
                    <ul className="text-sm space-y-1">
                      {product.useCases.slice(0, 3).map(useCase => (
                        <li key={useCase} className="text-neutral-300">
                          • {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Audio Info */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-400">Audio:</span>
                  <span className={product.hasAudio ? "text-green-400" : "text-neutral-400"}>
                    {product.hasAudio ? "✓ Included" : "✗ No audio"}
                  </span>
                </div>
              </div>

              {/* Auth Check */}
              {!user && (
                <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                  <p className="text-sm text-blue-200 mb-3">
                    Sign in to purchase and download this video
                  </p>
                  <Link href="/signin" className="inline-block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}

              {/* Price & Purchase */}
              {user && (
                <div className="space-y-4 pt-4 border-t border-neutral-800">
                  <div className="flex items-baseline justify-between">
                    <span className="text-neutral-400">Price</span>
                    <span className="text-4xl font-bold text-[#D4FF4F]">
                      €{product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-neutral-800 rounded-lg p-4 text-sm text-neutral-300 space-y-2">
                    <p className="font-semibold text-white mb-3">What you get:</p>
                    <div className="flex items-start gap-2">
                      <span className="text-[#D4FF4F] mt-1">✓</span>
                      <span>Full HD video without watermark</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#D4FF4F] mt-1">✓</span>
                      <span>Rights of use & ownership transfer</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#D4FF4F] mt-1">✓</span>
                      <span>Original generation prompt & ID</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#D4FF4F] mt-1">✓</span>
                      <span>30-day download access</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="w-full bg-[#D4FF4F] hover:bg-[#D4FF4F]/90 text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Proceed to Checkout"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
