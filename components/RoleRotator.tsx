"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Cycles through role titles with a slide-up animation.
 * Leading words render in ink, the last word in white — matching the
 * two-tone treatment of the hero headline.
 */
export default function RoleRotator({
  roles,
  intervalMs = 2600,
}: {
  roles: string[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % roles.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [roles.length, intervalMs]);

  const words = roles[index].split(" ");
  const lead = words.slice(0, -1).join(" ");
  const last = words[words.length - 1];

  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={roles[index]}
          initial={reduceMotion ? false : { y: "105%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? undefined : { y: "-105%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 md:whitespace-nowrap"
        >
          {lead && <span className="text-panel-ink">{lead} </span>}
          <span className="text-white">{last}.</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
