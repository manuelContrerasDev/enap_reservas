import { useReducedMotion } from "framer-motion";

/** Variants reutilizables de framer-motion */
export function useFadeUp(duration = 0.35) {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { duration } };
}
