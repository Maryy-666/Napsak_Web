"use client";

import React, { forwardRef, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";

// Simple utility function to merge classes without external library dependencies
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  isValid?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  showClearButton?: boolean;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      helperText,
      errorText,
      isValid = false,
      required,
      disabled,
      type = "text",
      leftIcon,
      rightIcon,
      onClear,
      showClearButton = false,
      id: customId,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const internalId = useId();
    const inputId = customId || internalId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = !!errorText;
    const hasHelper = !!helperText;

    // Build aria-describedby references
    const describedBy = cn(
      hasError && errorId,
      hasHelper && helperId
    ) || undefined;

    return (
      <div className={cn("flex flex-col w-full text-left", containerClassName)}>
        {/* Label block with required asterisk and (zorunlu) text for accessibility */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-[15px] font-medium text-[#0F1115] mb-2 inline-flex items-center gap-1 select-none"
          >
            {label}
            {required && (
              <>
                <span className="text-[#DC2626]" aria-hidden="true">
                  *
                </span>
                <span className="text-xs text-[#9FA6B2] font-normal font-sans ml-0.5">
                  (zorunlu)
                </span>
              </>
            )}
          </label>
        )}

        {/* Input Wrapper holding icons and absolute controls */}
        <div className="relative w-full group">
          {/* Left Icon (Absolute alignment) */}
          {leftIcon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#5F6773] pointer-events-none"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          {/* Core Input Field */}
          <input
            ref={ref}
            type={type}
            id={inputId}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={describedBy}
            className={cn(
              // Layout and Typography
              "w-full h-10 text-base bg-white text-[#0F1115] rounded-[8px] border outline-none shadow-sm transition-all duration-150 ease-in-out",
              // Responsive Padding adjustments for icons
              leftIcon ? "pl-10" : "pl-3.5",
              rightIcon || (showClearButton && value) || hasError || isValid ? "pr-10" : "pr-3.5",
              // Disabled layout state
              disabled
                ? "bg-[#F8F9FA] text-[#9FA6B2] border-[#EEF0F2] cursor-not-allowed"
                : cn(
                    // Default interactive states
                    "border-[#EEF0F2] placeholder-[#9FA6B2]",
                    "hover:border-[#D1D5DB]",
                    // Dynamic Validation and Focus Ring glows
                    hasError
                      ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[4px] focus:ring-[#DC2626]/12"
                      : isValid
                      ? "border-[#0A5C3A] focus:border-[#0A5C3A] focus:ring-[4px] focus:ring-[#0A5C3A]/12"
                      : "focus:border-[#0A5C3A] focus:ring-[4px] focus:ring-[#0A5C3A]/12"
                  ),
              className
            )}
            {...props}
          />

          {/* Right Area: Clear Button or Custom Right Icon or Validation Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            {/* Clear Button */}
            {showClearButton && value && !disabled && (
              <button
                type="button"
                onClick={onClear}
                className="p-0.5 rounded-full text-[#5F6773] hover:bg-[#F1F3F5] hover:text-[#0F1115] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A]/20 transition-all cursor-pointer pointer-events-auto"
                title="Temizle"
                aria-label="Input alanını temizle"
              >
                <X className="w-3.5 h-3.5 stroke-[2.2px]" />
              </button>
            )}

            {/* Error indicator icon */}
            {hasError && !rightIcon && (
              <AlertCircle className="w-4 h-4 text-[#DC2626]" aria-hidden="true" />
            )}

            {/* Success indicator icon */}
            {isValid && !hasError && !rightIcon && (
              <CheckCircle2 className="w-4 h-4 text-[#0A5C3A]" aria-hidden="true" />
            )}

            {/* Custom Right Icon */}
            {rightIcon && (
              <div className="flex items-center justify-center text-[#5F6773] pointer-events-auto">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic validation messages with AnimatePresence for smooth entry/exit */}
        <AnimatePresence initial={false}>
          {hasError ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              id={errorId}
              className="text-xs text-[#DC2626] mt-1.5 flex items-center gap-1.5 font-medium overflow-hidden"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0 stroke-[2px]" aria-hidden="true" />
              {errorText}
            </motion.p>
          ) : hasHelper ? (
            <motion.p
              key="helper"
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.12 }}
              id={helperId}
              className="text-xs text-[#5F6773] mt-1.5 select-none"
            >
              {helperText}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";
