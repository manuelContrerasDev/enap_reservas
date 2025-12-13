import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonStyles = cva(
  `
  inline-flex items-center justify-center gap-2
  rounded-enap font-semibold select-none
  transition-all active:scale-[0.98]
  shadow-enapSm
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2
  `,
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
        sm: "text-sm px-3 py-1.5",
        md: "text-base px-4 py-2.5",
        lg: "text-lg px-5 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {}

export default function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
}
