"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TypingRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function TypingReveal({ text, className, delay = 0 }: TypingRevealProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (delay > 0) {
      timeout = setTimeout(() => setIsAnimating(true), delay * 1000);
    } else {
      setIsAnimating(true);
    }

    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!isAnimating) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
      }
    }, 20); // Speed of typing

    return () => clearInterval(interval);
  }, [isAnimating, text]);

  return (
    <p className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-0.5 h-5 bg-blue-500 ml-1 align-middle"
      />
    </p>
  );
}
