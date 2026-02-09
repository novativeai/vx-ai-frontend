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
import { CheckCircle, AlertCircle, Play, Download } from "lucide-react";
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

// Memoized purchased video card for marketplace with shimmer loading
const PurchasedVideoCardMarketplace = React.memo(function PurchasedVideoCardMarketplace({
  video,
}: {
  video: PurchasedVideo;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleMediaReady = React.useCallback(() => {
    setMediaLoaded(true);
  }, []);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.videoUrl) {
      const link = document.createElement("a");
      link.href = video.videoUrl;
      link.download = `${video.title || "video"}.mp4`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      className="group text-left w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="overflow-hidden rounded-2xl relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4FF4F]/20 hover:scale-[1.02] p-0 gap-0 border-neutral-800 hover:border-neutral-700">
        {/* Square card container with video maintaining its natural aspect ratio inside */}
        <div className="bg-neutral-900 relative overflow-hidden aspect-square">
          {/* Skeleton shimmer — visible until media loads */}
          {!mediaLoaded && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-neutral-800" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-neutral-700/40 to-transparent" />
            </div>
          )}

          {video.videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={video.videoUrl}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${mediaLoaded ? "opacity-100" : "opacity-0"}`}
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedData={handleMediaReady}
              />
              {/* Play indicator on hover */}
              <div className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-[#D4FF4F]/90 rounded-full p-3 backdrop-blur-sm">
                  <Play size={24} className="fill-black text-black" />
                </div>
              </div>
            </>
          ) : video.thumbnailUrl ? (
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className={`object-contain transition-opacity duration-300 ${mediaLoaded ? "opacity-100" : "opacity-0"}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onLoad={handleMediaReady}
            />
          ) : null}

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

          {/* Download button - top right */}
          <button
            onClick={handleDownload}
            className="absolute top-3 right-3 z-30 bg-[#D4FF4F] hover:bg-[#c2ef4a] text-black rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
          >
            <Download size={16} />
          </button>
        </div>

        {/* Product Info - overlaid at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-sm font-medium text-white line-clamp-1">{video.title}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-medium text-[#D4FF4F]">€{video.price.toFixed(2)}</span>
            <span className="text-[10px] text-neutral-400">by {video.sellerName}</span>
          </div>
          <p className="text-[10px] text-neutral-500 mt-2">
            {video.purchasedAt?.toDate().toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>
      </Card>
    </div>
  );
});

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
                <CheckCircle size={20} className="text-green-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-green-200">Purchase Successful!</p>
                  <p className="text-sm text-green-100">Check your email for download details and rights of use information.</p>
                </div>
              </>
            ) : purchaseStatus === "cancelled" ? (
              <>
                <AlertCircle size={20} className="text-red-400 mt-0.5 shrink-0" />
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
                  <PurchasedVideoCardMarketplace key={video.id} video={video} />
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
