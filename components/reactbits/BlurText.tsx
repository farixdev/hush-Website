"use client";

// Word-by-word blur-in text reveal (à la reactbits.dev "Blur Text"),
// implemented with Framer Motion.

import { motion } from "framer-motion";

export default function BlurText({
  text,
  className = "",
  delay = 0,
  as = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const words = text.split(" ");
  const MotionTag = motion[as] as typeof motion.span;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      variants={{ hidden: {}, show: {} }}
      style={{ display: "inline-block" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block will-change-[transform,filter,opacity]"
          variants={{
            hidden: { opacity: 0, filter: "blur(10px)", y: "0.35em" },
            show: {
              opacity: 1,
              filter: "blur(0px)",
              y: "0em",
              transition: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] },
            },
          }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}
