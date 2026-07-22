"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, TargetAndTransition } from "framer-motion";

type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-in"
  | "scale-in"
  | "fade-up-blur";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  as?: "div" | "section" | "span" | "article" | "li";
}

const variantMap: Record<RevealVariant, { initial: TargetAndTransition; animate: TargetAndTransition }> = {
  "fade-up": {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-down": {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
  },
  "fade-left": {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
  },
  "fade-right": {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
  },
  "fade-in": {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  "scale-in": {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
  },
  "fade-up-blur": {
    initial: { opacity: 0, y: 24, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
};

export default function Reveal({
  children,
  variant = "fade-up",
  className = "",
  delay = 0,
  duration = 0.6,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-40px" });

  const { initial, animate } = variantMap[variant];

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? animate : initial}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
