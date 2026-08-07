"use client";

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, InputProps } from "../ui/Input";

export interface PasswordInputProps extends Omit<InputProps, "type" | "rightIcon"> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleToggle = () => {
      if (disabled) return;
      setShowPassword((prev) => !prev);
    };

    // Toggle button in the rightIcon slot of the Input component
    const toggleButton = (
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className="p-1 -mr-1.5 rounded-full text-[#5F6773] hover:bg-[#F1F3F5] hover:text-[#0F1115] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A]/20 transition-all cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
        aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
        aria-pressed={showPassword}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={showPassword ? "visible" : "hidden"}
            initial={{ opacity: 0, rotate: -12, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 12, scale: 0.9 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 stroke-[1.75px]" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4 stroke-[1.75px]" aria-hidden="true" />
            )}
          </motion.div>
        </AnimatePresence>
      </button>
    );

    return (
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        disabled={disabled}
        rightIcon={toggleButton}
        showClearButton={false} // Overridden to prevent collision with password toggle
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";
