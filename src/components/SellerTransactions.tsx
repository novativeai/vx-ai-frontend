"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface SellerTransaction {
  id: string;
  videoId: string;
  buyerId: string;
  amount: number;
  timestamp?: Date | { toDate: () => Date };
  status: "completed" | "pending";
  paytrustTransactionId?: string;
}

export function SellerTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<SellerTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "seller_transactions"),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setTransactions(
          snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as SellerTransaction)
          )
        );
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const handleExport = async (format: "csv" | "pdf") => {
    if (!user) return;

    setExporting(format);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/transactions/export?format=${format}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export transactions");
      }

      // Get filename from Content-Disposition header or create one
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `transactions.${format}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename=([^;]+)/);
        if (match) filename = match[1].replace(/"/g, "");
      }

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export transactions. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 bg-neutral-800" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="bg-neutral-900/50 border-neutral-800 p-12 text-center">
        <p className="text-neutral-400 mb-2">No sales yet</p>
        <p className="text-sm text-neutral-500">
          When you sell videos on the marketplace, they&apos;ll appear here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Export Buttons */}
      {transactions.length > 0 && (
        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => handleExport("csv")}
            disabled={exporting !== null}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            size="sm"
          >
            {exporting === "csv" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export as CSV
          </Button>
          <Button
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium"
            size="sm"
          >
            {exporting === "pdf" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export as PDF
          </Button>
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <Card
            key={transaction.id}
            className="bg-neutral-950/50 border-neutral-700 p-4 hover:bg-neutral-900/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">Video Sale</p>
                    <p className="text-sm font-mono text-neutral-300">
                      Buyer: {transaction.buyerId?.substring(0, 8)}...
                    </p>
                  </div>
                </div>
                <p className="text-xs text-neutral-500">
                  {transaction.timestamp && typeof transaction.timestamp === 'object' && 'toDate' in transaction.timestamp ? transaction.timestamp.toDate().toLocaleDateString() : "Date pending"}
                </p>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-green-400">€{transaction.amount.toFixed(2)}</p>
                  <Badge
                    variant={transaction.status === "completed" ? "default" : "secondary"}
                    className={
                      transaction.status === "completed"
                        ? "bg-green-600/20 text-green-400"
                        : "bg-yellow-600/20 text-yellow-400"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
