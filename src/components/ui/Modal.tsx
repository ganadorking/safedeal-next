"use client";

import { useEffect, useCallback, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  maxWidth = "max-w-lg",
  children,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.body.style.overflow = prevOverflow;
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(26, 16, 37, 0.5)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        animation: "sdModalOverlayIn 200ms ease-out forwards",
      }}
    >
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-xl`}
        style={{
          animation: "sdModalCardIn 200ms ease-out forwards",
        }}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-5">
            <h2 className="text-lg font-bold text-[#0F172A]">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0] transition-colors text-lg"
            >
              &times;
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>

      <style jsx global>{`
        @keyframes sdModalOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sdModalCardIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
