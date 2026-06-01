import type { Variants } from "framer-motion";

// ── Fade up — used on section entry ───────────────────────────────────────
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// ── Stagger container — wraps multiple fadeUp children ────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// ── Fade in (no movement) — used for overlays, images ─────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// ── Slide in from left — used for the hero eyebrow/tag ────────────────────
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Scale up — used for KPI cards on hover ────────────────────────────────
export const scaleUp: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// ── Viewport config — reused across all motion.div whileInView ────────────
export const viewportConfig = {
  once: true,
  margin: "-80px",
};
