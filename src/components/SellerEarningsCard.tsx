"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Wallet, ArrowUpRight, Clock } from "lucide-react";
import { logger } from "@/lib/logger";

interface SellerBalance {
  totalEarned: number;
  availableBalance: number;
  pendingBalance: number;
  withdrawnBalance: number;
  lastTransactionDate?: Date | { toDate: () => Date };
}

interface SellerEarningsCardProps {
  onWithdrawClick?: (availableBalance: number) => void;
}

export function SellerEarningsCard({ onWithdrawClick }: SellerEarningsCardProps) {
  const { user } = useAuth();
  const [balance, setBalance] = useState<SellerBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Set up real-time listener for seller balance
    const balanceRef = doc(db, "users", user.uid, "seller_balance", "current");
    const unsub = onSnapshot(
      balanceRef,
      (doc) => {
        if (doc.exists()) {
          setBalance(doc.data() as SellerBalance);
        } else {
          // No balance yet - seller hasn't made any sales
          setBalance({
            totalEarned: 0,
            availableBalance: 0,
            pendingBalance: 0,
            withdrawnBalance: 0,
          });
        }
        setLoading(false);
      },
      (error) => {
        logger.error("Error fetching seller balance", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 bg-neutral-800" />
      </div>
    );
  }

  if (!balance) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earned */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-400">Total Earned</p>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">€{balance.totalEarned.toFixed(2)}</p>
          <p className="text-xs text-neutral-500 mt-2">From marketplace sales</p>
        </Card>

        {/* Available Balance */}
        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-400">Available</p>
            <Wallet className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">€{balance.availableBalance.toFixed(2)}</p>
          <p className="text-xs text-neutral-500 mt-2">Ready to withdraw</p>
        </Card>

        {/* Pending Payout */}
        {balance.pendingBalance > 0 && (
          <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-700/50 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-neutral-400">Pending Payout</p>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-white">€{balance.pendingBalance.toFixed(2)}</p>
            <p className="text-xs text-neutral-500 mt-2">Being processed</p>
          </Card>
        )}

        {/* Withdrawn Balance */}
        <Card className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-700/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-400">Withdrawn</p>
            <ArrowUpRight className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">€{balance.withdrawnBalance.toFixed(2)}</p>
          <p className="text-xs text-neutral-500 mt-2">Total transferred</p>
        </Card>
      </div>

      {/* Withdraw Button */}
      {balance.availableBalance > 0 && (
        <Button
          onClick={() => onWithdrawClick?.(balance.availableBalance)}
          className="w-full bg-[#D4FF4F] text-black hover:bg-[#c2ef4a] font-semibold py-6"
        >
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Withdraw €{balance.availableBalance.toFixed(2)}
        </Button>
      )}

      {balance.availableBalance === 0 && balance.totalEarned === 0 && (
        <Card className="bg-neutral-900/50 border-neutral-800 p-8 text-center">
          <TrendingUp className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-300 font-medium mb-2">No earnings yet</p>
          <p className="text-sm text-neutral-500">
            View your{" "}
            <a
              href="/explore#history"
              className="text-[#D4FF4F] underline hover:text-[#c2ef4a]"
            >
              seller history
            </a>{" "}
            or list videos on the marketplace to earn money
          </p>
        </Card>
      )}
    </div>
  );
}
