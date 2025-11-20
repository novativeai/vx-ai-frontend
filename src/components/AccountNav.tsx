"use client";

import { User, History, ShoppingBag, TrendingUp } from "lucide-react";

export type AccountTab = "account" | "history" | "purchased" | "seller";

interface AccountNavProps {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
}

export function AccountNav({ activeTab, onTabChange }: AccountNavProps) {
  const navItems: Array<{ id: AccountTab; label: string; icon: React.ReactNode }> = [
    {
      id: "account",
      label: "Account",
      icon: <User className="w-5 h-5" />,
    },
    {
      id: "history",
      label: "History",
      icon: <History className="w-5 h-5" />,
    },
    {
      id: "purchased",
      label: "Purchased",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      id: "seller",
      label: "Seller",
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="hidden lg:flex flex-col gap-1 w-48">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
            activeTab === item.id
              ? "bg-[#D4FF4F] text-black font-semibold shadow-lg shadow-[#D4FF4F]/20"
              : "text-neutral-300 hover:text-white hover:bg-neutral-800/50"
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

// Mobile dropdown version
export function AccountNavMobile({ activeTab, onTabChange }: AccountNavProps) {
  const navItems: Array<{ id: AccountTab; label: string }> = [
    { id: "account", label: "Account" },
    { id: "history", label: "History" },
    { id: "purchased", label: "Purchased" },
    { id: "seller", label: "Seller" },
  ];

  return (
    <div className="lg:hidden mb-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm ${
              activeTab === item.id
                ? "bg-[#D4FF4F] text-black"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
