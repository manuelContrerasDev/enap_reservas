// src/components/ui/kit/EnapButton.tsx
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonStyles = cva(
  "px-4 py-2 rounded-enap font-semibold shadow-enapSm transition-all select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "text-white bg-gold hover:bg-gold-dark",
        secondary: "text-white bg-azul-700 hover:bg-azul-800",
        outline:
          "border border-gold text-gold hover:bg-gold hover:text-white",
        ghost: "text-azul-700 hover:bg-azul-100",
      },
      size: {
        sm: "text-sm py-1.5",
        md: "text-base py-2.5",
        lg: "text-lg py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface EnapButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {}

export default function EnapButton({
  className,
  variant,
  size,
  ...props
}: EnapButtonProps) {
  return (
    <button
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
}
