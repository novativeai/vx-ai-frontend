"use client";

import React, { useEffect, useState, Suspense } from "react";
import { CreateProductSkeleton } from "@/components/ui/premium-skeleton";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { collection, doc, getDoc, addDoc, serverTimestamp, type FieldValue } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Generation, MarketplaceProduct } from "@/types/types";
import { logger } from "@/lib/logger";
import { toast } from "@/hooks/use-toast";

function ProductCreationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const generationId = searchParams.get("generationId");

  // Form States
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    tags: "",
    hasAudio: true,
    useCases: "",
  });

  // Fetch the generation details
  useEffect(() => {
    if (!user || !generationId) {
      router.push("/explore");
      return;
    }

    const fetchGeneration = async () => {
      try {
        const genRef = doc(db, "users", user.uid, "generations", generationId);
        const genSnap = await getDoc(genRef);
        if (genSnap.exists()) {
          setGeneration({ id: genSnap.id, ...genSnap.data() } as Generation);
        } else {
          toast.error("Not found", "Generation not found");
        }
      } catch (err) {
        toast.error("Load failed", "Failed to load generation");
        logger.error("Error fetching generation", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneration();
  }, [user, generationId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !generation) return;

    setSubmitting(true);

    try {
      // Validate form
      if (!formData.title || !formData.price || !formData.tags) {
        throw new Error("Please fill in all required fields");
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error("Price must be a valid positive number");
      }

      // Get user name from auth
      const userName = user.displayName || user.email || "Anonymous";

      // Create marketplace product
      const productData: Omit<MarketplaceProduct, "id"> = {
        sellerId: user.uid,
        sellerName: userName,
        title: formData.title,
        description: formData.description,
        videoUrl: generation.outputUrl,
        generationId: generation.id,
        prompt: generation.prompt,
        price: price,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        hasAudio: formData.hasAudio,
        useCases: formData.useCases.split(",").map(uc => uc.trim()).filter(Boolean),
        thumbnailUrl: generation.outputUrl,
        status: "published",
        createdAt: serverTimestamp() as FieldValue,
        updatedAt: serverTimestamp() as FieldValue,
        sold: 0,
      };

      // Save to user's marketplace items
      const userItemRef = await addDoc(
        collection(db, "users", user.uid, "marketplace_items"),
        productData
      );

      // Also save to global marketplace listings for discovery
      await addDoc(
        collection(db, "marketplace_listings"),
        {
          ...productData,
          itemId: userItemRef.id,
        }
      );

      // Redirect to marketplace page
      toast.success("Success", "Your video has been listed on the marketplace");
      router.push("/marketplace");
    } catch (err) {
      toast.error("Listing failed", err instanceof Error ? err.message : "Failed to create product listing");
      logger.error("Failed to create product listing", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4FF4F]"></div>
          </div>
          <p>Loading generation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href="/explore" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} />
          Back to History
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tighter mb-2">List Your Video</h1>
          <p className="text-neutral-400 mb-12">Fill in the details to sell your creation on our marketplace</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Video Preview */}
            <div>
              <div className="sticky top-20">
                <h3 className="text-sm uppercase tracking-widest text-neutral-400 mb-4">Preview</h3>
                {generation && (
                  <Card className="overflow-hidden rounded-2xl">
                    <AspectRatio ratio={1 / 1} className="bg-neutral-800">
                      {generation.outputType === "video" ? (
                        <video
                          src={generation.outputUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={generation.outputUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      )}
                    </AspectRatio>
                  </Card>
                )}
                <div className="mt-6 p-4 bg-neutral-900 rounded-lg">
                  <p className="text-sm text-neutral-400 mb-2">Original Prompt</p>
                  <p className="text-sm">{generation?.prompt}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Product Title *</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Futuristic City Intro Video"
                    className="bg-neutral-900/50 border-neutral-800 text-white"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your video, its mood, style, and potential uses..."
                    rows={4}
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 resize-none"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-2">Price (EUR) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">€</span>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="99.99"
                      className="bg-neutral-900/50 border-neutral-800 text-white pl-8"
                      required
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags * (comma separated)</label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., futuristic, cinematic, intro, tech"
                    className="bg-neutral-900/50 border-neutral-800 text-white"
                    required
                  />
                </div>

                {/* Audio */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="hasAudio"
                    id="hasAudio"
                    checked={formData.hasAudio}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded bg-neutral-900 border border-neutral-700 cursor-pointer"
                  />
                  <label htmlFor="hasAudio" className="text-sm font-medium cursor-pointer">
                    Video includes audio
                  </label>
                </div>

                {/* Use Cases */}
                <div>
                  <label className="block text-sm font-medium mb-2">Use Cases (comma separated)</label>
                  <textarea
                    name="useCases"
                    value={formData.useCases}
                    onChange={handleInputChange}
                    placeholder="e.g., YouTube intro, TikTok transition, web background"
                    rows={3}
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#D4FF4F] hover:bg-[#D4FF4F]/90 text-black font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
                >
                  {submitting ? "Publishing..." : "Publish to Marketplace"}
                </Button>

                <p className="text-xs text-neutral-500 text-center">
                  You&apos;ll earn 80% of the sale price. reelzila takes 20%.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCreationPage() {
  return (
    <Suspense fallback={<CreateProductSkeleton />}>
      <ProductCreationContent />
    </Suspense>
  );
}
