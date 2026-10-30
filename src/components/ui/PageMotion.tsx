"use client";

import { animate, motion, useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Page-level entrance: fade + slide up on mount */
export function PageMotion({ children, className = "" }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Scroll-triggered reveal: fade + slide up when entering viewport */
export function ScrollReveal({ children, className = "", delay = 0 }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Scroll-triggered reveal from left */
export function SlideInLeft({ children, className = "", delay = 0 }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Scroll-triggered reveal from right */
export function SlideInRight({ children, className = "", delay = 0 }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Fade in with scale — for callout boxes, badges */
export function FadeScale({ children, className = "", delay = 0 }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Staggered container — wraps children that each have their own delay */
export function StaggerContainer({ children, className = "" }: MotionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Stagger item — child of StaggerContainer */
export function StaggerItem({ children, className = "" }: MotionProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 26, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.48, ease: [0.25, 0.1, 0.25, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Card hover: springy lift + subtle scale */
export function HoverLift({ children, className = "" }: MotionProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.018 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Magnetic hover — for buttons and small interactive elements */
export function MagneticHover({ children, className = "" }: MotionProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface CountUpProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Number that counts up to its value the first time it scrolls into view */
export function CountUp({ value, suffix = "", duration = 1.4, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {reduceMotion ? value : display}
      {suffix}
    </span>
  );
}

/** Scroll progress bar — fixed to the top of the viewport */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      id="scroll-progress"
      style={{ scaleX }}
    />
  );
}
