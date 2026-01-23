"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { DynamicBanner, BannerSlide } from "@/components/DynamicBanner";
import { MarketplaceSidebar } from "@/components/MarketplaceSidebar";
import { MarketplaceGrid } from "@/components/MarketplaceGrid";
import { PurchaseFormModal } from "@/components/PurchaseFormModal";
import { MarketplaceProduct } from "@/types/types";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logger } from "@/lib/logger";

interface PurchasedVideo {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  price: number;
  sellerName: string;
  purchasedAt: {
    toDate: () => Date;
  };
}

const bannerSlides: BannerSlide[] = [
  {
    videoSrc: "https://storage.googleapis.com/reelzila.firebasestorage.app/website/videos/tron-1.mp4",
    title: "Best Community",
    subtitle: "Join thousands of creators selling premium video content. Build your business with full usage rights.",
    buttonText: "Start Selling",
    buttonLink: "/explore",
  },
];

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const purchaseStatus = searchParams.get("purchase");
  const { user } = useAuth();

  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showStatusMessage, setShowStatusMessage] = useState(!!purchaseStatus);
  const [purchased, setPurchased] = useState<PurchasedVideo[]>([]);

  // Fetch all published marketplace products
  useEffect(() => {
    const q = query(
      collection(db, "marketplace_listings"),
      where("status", "==", "published")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as MarketplaceProduct[];

        // Sort by createdAt descending
        productsData.sort((a, b) => {
          const dateA = a.createdAt && typeof a.createdAt === 'object' && 'toDate' in a.createdAt ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt && typeof b.createdAt === 'object' && 'toDate' in b.createdAt ? b.createdAt.toDate() : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setProducts(productsData);
        setIsLoading(false);
      },
      (error) => {
        logger.error("Error fetching marketplace_listings", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch user's purchased videos
  useEffect(() => {
    if (!user) {
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "purchased_videos"),
      orderBy("purchasedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const purchasedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as PurchasedVideo));
        setPurchased(purchasedData);
      },
      (error) => {
        logger.error("Error fetching purchased_videos", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Combine tag extraction and filtering into single memoized operation
  const { allTags, allUseCases, filteredProducts } = useMemo(() => {
    const tagSet = new Set<string>();
    const useCaseSet = new Set<string>();

    const filtered = products.filter(product => {
      // Collect tags and use cases while filtering
      product.tags?.forEach(tag => tagSet.add(tag));
      product.useCases?.forEach(useCase => useCaseSet.add(useCase));

      const tagMatch = selectedTags.length === 0 ||
        selectedTags.some(tag => product.tags?.includes(tag));
      const useCaseMatch = selectedUseCases.length === 0 ||
        selectedUseCases.some(useCase => product.useCases?.includes(useCase));

      return tagMatch && useCaseMatch;
    });

    return {
      allTags: Array.from(tagSet).sort(),
      allUseCases: Array.from(useCaseSet).sort(),
      filteredProducts: filtered
    };
  }, [products, selectedTags, selectedUseCases]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  const handleUseCaseToggle = (useCase: string) => {
    setSelectedUseCases(prev =>
      prev.includes(useCase)
        ? prev.filter(u => u !== useCase)
        : [...prev, useCase]
    );
  };

  const handleClearUseCases = () => {
    setSelectedUseCases([]);
  };

  const handleProductClick = (product: MarketplaceProduct) => {
    setSelectedProduct(product);
    setShowPurchaseModal(true);
  };

  return (
    <div className="bg-black text-white">
      <DynamicBanner slides={bannerSlides} />

      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Purchase Status Message */}
        {showStatusMessage && (
          <div className="mb-8 p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-500" style={{
            backgroundColor: purchaseStatus === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
            borderColor: purchaseStatus === "success" ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
            borderWidth: "1px"
          }}>
            {purchaseStatus === "success" ? (
              <>
                <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-200">Purchase Successful!</p>
                  <p className="text-sm text-green-100">Check your email for download details and rights of use information.</p>
                </div>
              </>
            ) : purchaseStatus === "cancelled" ? (
              <>
                <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-200">Purchase Cancelled</p>
                  <p className="text-sm text-red-100">The payment was cancelled. Feel free to try again.</p>
                </div>
              </>
            ) : null}
            <button
              onClick={() => setShowStatusMessage(false)}
              className="ml-auto text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        <div className="space-y-12">
          {/* Your Purchases Section - Only show if user is logged in and has purchases */}
          {user && purchased.length > 0 && (
            <section id="my-library" className="pb-12 border-b border-neutral-800 scroll-mt-24">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-widest text-neutral-400">My Library</p>
                <h2 className="text-3xl md:text-4xl font-regular tracking-tighter mt-2">Your Purchases</h2>
                <p className="max-w-2xl text-neutral-300 mt-2 text-sm">
                  {purchased.length} {purchased.length === 1 ? "video" : "videos"} in your library
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {purchased.map((video) => (
                  <div key={video.id} className="group cursor-pointer">
                    <Card className="overflow-hidden rounded-lg border-neutral-800 hover:border-neutral-700 transition-colors bg-transparent">
                      <div className="aspect-square bg-transparent relative overflow-hidden">
                        {video.videoUrl ? (
                          <video
                            src={video.videoUrl}
                            className="absolute inset-0 w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                            muted
                            loop
                          />
                        ) : video.thumbnailUrl ? (
                          <Image
                            src={video.thumbnailUrl}
                            alt={video.title}
                            fill
                            className="object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-white line-clamp-2 text-sm group-hover:text-[#D4FF4F] transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1">by {video.sellerName}</p>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-700/30">
                          <p className="text-xs text-neutral-400">
                            {video.purchasedAt?.toDate().toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs font-medium text-[#D4FF4F]">
                            €{video.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* See all purchases link */}
          {user && purchased.length > 0 && (
            <div className="flex justify-end mb-4">
              <Link href="/account?tab=purchased">
                <Button variant="outline" className="border-neutral-700 text-white hover:bg-neutral-900">
                  View All Purchases
                </Button>
              </Link>
            </div>
          )}
          {/* Section Title */}
          <section>
            <div className="mb-12">
              <p className="text-sm uppercase tracking-widest text-neutral-400">Discover & Buy</p>
              <h2 className="text-4xl md:text-6xl font-regular tracking-tighter mt-2">Marketplace</h2>
              <p className="max-w-2xl text-neutral-300 mt-4">
                Browse and purchase high-quality videos from our community of creators. Every purchase comes with full rights of use.
              </p>
            </div>
          </section>

          {/* Main Content Layout */}
          <section className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            {(allTags.length > 0 || allUseCases.length > 0) && (
              <aside className="lg:min-w-fit">
                <MarketplaceSidebar
                  availableTags={allTags}
                  selectedTags={selectedTags}
                  onTagToggle={handleTagToggle}
                  onClearTags={handleClearTags}
                  availableUseCases={allUseCases}
                  selectedUseCases={selectedUseCases}
                  onUseCaseToggle={handleUseCaseToggle}
                  onClearUseCases={handleClearUseCases}
                  productCount={filteredProducts.length}
                />
              </aside>
            )}

            {/* Products Grid */}
            <div className="flex-1 space-y-8">
              <div className="mb-4">
                <p className="text-sm text-neutral-400">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "video" : "videos"} available
                </p>
              </div>
              <MarketplaceGrid
                products={filteredProducts}
                isLoading={isLoading}
                onProductClick={handleProductClick}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedProduct && (
        <PurchaseFormModal
          product={selectedProduct}
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
