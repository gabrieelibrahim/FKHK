"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export default function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.07,
}: StaggerProps) {
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((childNode, i) => (
            <motion.div key={i} variants={child}>
              {childNode}
            </motion.div>
          ))
        : <motion.div variants={child}>{children}</motion.div>}
    </motion.div>
  );
}
