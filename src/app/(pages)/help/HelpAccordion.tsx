"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

export default function HelpAccordion({ sections }: { sections: FAQSection[] }) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">
            {section.title}
          </h2>
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] overflow-hidden divide-y divide-[#E2E8F0]">
            {section.items.map((item, idx) => {
              const key = `${section.title}-${idx}`;
              const isOpen = openItems[key] ?? false;
              return (
                <div key={key}>
                  <button
                    onClick={() => toggleItem(key)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#F8FAFC] transition-colors"
                  >
                    <span className="font-medium text-[#0F172A] pr-4">
                      {item.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-[#94A3B8] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-[#64748B] text-sm leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
