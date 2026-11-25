"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** Prototype-only RoleRotator that uses theme tokens instead of the blue-panel colors. */
export default function ThemedRoleRotator({
  roles,
  className,
}: {
  roles: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [roles.length, reduceMotion]);

  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={roles[index]}
          initial={reduceMotion ? false : { y: "105%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? undefined : { y: "-105%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`col-start-1 row-start-1 ${className ?? "text-brand"}`}
        >
          {roles[index]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
