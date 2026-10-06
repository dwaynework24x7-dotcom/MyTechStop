"use client";

import { createContext, useContext, useState } from "react";

import { BuyerForm } from "@/components/forms/BuyerForm";
import { SellerForm } from "@/components/forms/SellerForm";

type InquiryContextValue = {
  openBuyer: () => void;
  openSeller: (focusFile?: boolean) => void;
};

const InquiryContext = createContext<InquiryContextValue | null>(null);

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"buy" | "sell" | null>(null);
  const [focusFile, setFocusFile] = useState(false);

  const value: InquiryContextValue = {
    openBuyer: () => {
      setFocusFile(false);
      setMode("buy");
    },
    openSeller: (nextFocusFile = false) => {
      setFocusFile(nextFocusFile);
      setMode("sell");
    },
  };

  return (
    <InquiryContext.Provider value={value}>
      {children}
      <BuyerForm open={mode === "buy"} onClose={() => setMode(null)} />
      <SellerForm open={mode === "sell"} focusFile={focusFile} onClose={() => setMode(null)} />
    </InquiryContext.Provider>
  );
}

export function useInquiry(): InquiryContextValue {
  const value = useContext(InquiryContext);
  if (!value) throw new Error("useInquiry must be used within InquiryProvider");
  return value;
}

export function OpenInquiry({
  intent,
  focusFile = false,
  className,
  children,
}: {
  intent: "buy" | "sell";
  focusFile?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const inquiry = useInquiry();
  return (
    <button
      type="button"
      className={className}
      onClick={() => (intent === "buy" ? inquiry.openBuyer() : inquiry.openSeller(focusFile))}
    >
      {children}
    </button>
  );
}
