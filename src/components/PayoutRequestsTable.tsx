"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CheckCircle, XCircle, RefreshCw, AlertCircle } from "lucide-react";

interface PayoutRequest {
  id: string;
  amount: number;
  paypalEmail: string;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt?: Date | { toDate: () => Date };
  approvedAt?: Date | { toDate: () => Date };
  rejectedAt?: Date | { toDate: () => Date };
}

interface NotificationState {
  id: string;
  type: "approved" | "completed" | "rejected";
  amount: number;
}

export function PayoutRequestsTable() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const previousRequestsRef = useRef<PayoutRequest[]>([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "payout_requests"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const newRequests = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as PayoutRequest)
        );

        // Detect status changes and show notifications
        newRequests.forEach((newRequest) => {
          const previousRequest = previousRequestsRef.current.find(
            (r) => r.id === newRequest.id
          );

          if (previousRequest && previousRequest.status !== newRequest.status) {
            // Status changed, show notification
            setNotification({
              id: newRequest.id,
              type: newRequest.status as "approved" | "completed" | "rejected",
              amount: newRequest.amount,
            });

            // Auto-hide notification after 5 seconds
            const timer = setTimeout(() => {
              setNotification(null);
            }, 5000);

            return () => clearTimeout(timer);
          }
        });

        setRequests(newRequests);
        previousRequestsRef.current = newRequests;
        setLastUpdated(new Date());
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching payout requests:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 bg-neutral-800" />
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="bg-neutral-900/50 border-neutral-800 p-12 text-center">
        <p className="text-neutral-400 mb-2">No withdrawal requests yet</p>
        <p className="text-sm text-neutral-500">
          Submit a withdrawal request to transfer your pending balance to PayPal
        </p>
      </Card>
    );
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "approved":
        return "bg-blue-900/80 border-blue-700 text-blue-200";
      case "completed":
        return "bg-green-900/80 border-green-700 text-green-200";
      case "rejected":
        return "bg-red-900/80 border-red-700 text-red-200";
      default:
        return "bg-neutral-800 border-neutral-700 text-neutral-200";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getNotificationMessage = (type: string, amount: number) => {
    switch (type) {
      case "approved":
        return `Payout approved! €${amount.toFixed(2)} is ready for transfer.`;
      case "completed":
        return `Payout completed! €${amount.toFixed(2)} has been transferred.`;
      case "rejected":
        return `Payout rejected. €${amount.toFixed(2)} has been returned to your balance.`;
      default:
        return "Payout status updated.";
    }
  };

  return (
    <div className="space-y-4">
      {/* Notification Toast */}
      {notification && (
        <Card
          className={`p-4 border animate-in fade-in slide-in-from-top-2 duration-300 ${getNotificationColor(
            notification.type
          )}`}
        >
          <div className="flex items-center gap-3">
            {getNotificationIcon(notification.type)}
            <div className="flex-1">
              <p className="font-semibold">
                {notification.type.charAt(0).toUpperCase() +
                  notification.type.slice(1)}
              </p>
              <p className="text-sm opacity-90">
                {getNotificationMessage(notification.type, notification.amount)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Last Updated Info */}
      {lastUpdated && (
        <div className="flex items-center justify-between px-2 py-1 text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            <span>Live updates enabled</span>
          </div>
          <span>
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map((request) => (
          <Card
            key={request.id}
            className="bg-neutral-950/50 border-neutral-700 p-4 hover:bg-neutral-900/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">PayPal Email</p>
                    <p className="font-mono text-white text-sm">{request.paypalEmail}</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-500">
                  {request.createdAt && typeof request.createdAt === 'object' && 'toDate' in request.createdAt ? request.createdAt.toDate().toLocaleDateString() : "Date pending"}
                </p>
              </div>
              <div className="flex items-center gap-4 ml-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-white mb-2">€{request.amount.toFixed(2)}</p>
                  {getStatusBadge(request.status)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
