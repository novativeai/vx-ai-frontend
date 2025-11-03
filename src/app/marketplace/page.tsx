"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DynamicBanner, BannerSlide } from "@/components/DynamicBanner";
import { MarketplaceSidebar } from "@/components/MarketplaceSidebar";
import { MarketplaceGrid } from "@/components/MarketplaceGrid";
import { PurchaseFormModal } from "@/components/PurchaseFormModal";
import { MarketplaceProduct } from "@/types/types";
import { CheckCircle, AlertCircle } from "lucide-react";

const bannerSlides: BannerSlide[] = [
  {
    videoSrc: "/videos/tron-1.mp4",
    title: "Best Community",
    subtitle: "Join thousands of creators selling premium video content. Build your business with full usage rights.",
    buttonText: "Start Selling",
    buttonLink: "/explore",
  },
];

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const purchaseStatus = searchParams.get("purchase");

  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showStatusMessage, setShowStatusMessage] = useState(!!purchaseStatus);

  // Fetch all published marketplace products
  useEffect(() => {
    try {
      const q = query(
        collection(db, "marketplace_listings"),
        where("status", "==", "published")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as MarketplaceProduct[];

        // Sort by createdAt descending
        productsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setProducts(productsData);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching marketplace products:", error);
      setIsLoading(false);
    }
  }, []);

  // Get all unique tags from products
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    products.forEach(product => {
      product.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [products]);

  // Get all unique use cases from products
  const allUseCases = useMemo(() => {
    const useCaseSet = new Set<string>();
    products.forEach(product => {
      product.useCases?.forEach(useCase => useCaseSet.add(useCase));
    });
    return Array.from(useCaseSet).sort();
  }, [products]);

  // Filter products based on selected tags and use cases
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const tagMatch = selectedTags.length === 0 ||
        selectedTags.some(tag => product.tags?.includes(tag));

      const useCaseMatch = selectedUseCases.length === 0 ||
        selectedUseCases.some(useCase => product.useCases?.includes(useCase));

      return tagMatch && useCaseMatch;
    });
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
