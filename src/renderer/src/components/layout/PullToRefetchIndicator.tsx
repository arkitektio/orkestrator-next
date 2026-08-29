import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { BiRefresh } from "react-icons/bi";

const RADIUS = 19;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Arc endpoints for the indeterminate sweep: a short dash growing to a long one. */
const ARC_SHORT = CIRCUMFERENCE * 0.9;
const ARC_LONG = CIRCUMFERENCE * 0.25;

/**
 * The pull-to-refetch affordance: a ring that fills as you pull, turns solid
 * once releasing would fire, then becomes an indeterminate spinner while the
 * query re-runs.
 */
export const PullToRefetchIndicator = ({
  pull,
  progress,
  refreshing,
}: {
  pull: number;
  progress: number;
  refreshing: boolean;
}) => {
  const visible = pull > 0 || refreshing;
  const ready = progress >= 1;
  const filled = Math.min(progress, 1);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute left-0 right-0 top-16 z-20 flex flex-col items-center pointer-events-none"
          aria-live="polite"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <motion.div
            className="flex flex-col items-center gap-1.5"
            // While pulling, track the finger directly — a spring here would
            // feel laggy. Only the snap back to the spinner is animated.
            animate={{ y: refreshing ? 12 : pull }}
            transition={
              refreshing
                ? { type: "spring", stiffness: 400, damping: 28 }
                : { duration: 0 }
            }
          >
            <motion.div
              className={cn(
                "relative h-11 w-11 grid place-items-center rounded-full",
                "border bg-background/90 backdrop-blur-sm shadow-lg",
              )}
              animate={{ scale: ready && !refreshing ? 1.12 : 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 20 }}
            >
              {/* Soft primary halo, breathing while the query is in flight. */}
              <AnimatePresence>
                {refreshing && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/15"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0.35, 0.75, 0.35], scale: [1, 1.25, 1] }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                className="absolute inset-0"
                animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  refreshing
                    ? { duration: 0.9, repeat: Infinity, ease: "linear" }
                    : { duration: 0.2 }
                }
              >
                <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90">
                  <circle
                    cx="22"
                    cy="22"
                    r={RADIUS}
                    fill="none"
                    strokeWidth="2.5"
                    className="stroke-border"
                  />
                  <motion.circle
                    cx="22"
                    cy="22"
                    r={RADIUS}
                    fill="none"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    className={cn(
                      ready || refreshing
                        ? "stroke-primary"
                        : "stroke-muted-foreground",
                    )}
                    // Pulling: the arc mirrors progress. Refreshing: it sweeps
                    // between a short and long arc for an indeterminate feel.
                    animate={
                      refreshing
                        ? { strokeDashoffset: [ARC_SHORT, ARC_LONG, ARC_SHORT] }
                        : { strokeDashoffset: CIRCUMFERENCE * (1 - filled) }
                    }
                    transition={
                      refreshing
                        ? {
                            duration: 1.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                        : { duration: 0.08, ease: "linear" }
                    }
                  />
                </svg>
              </motion.div>

              <motion.div
                animate={{
                  rotate: refreshing ? 0 : filled * 270,
                  scale: refreshing ? 1.1 : 1,
                }}
                transition={{ duration: refreshing ? 0.2 : 0.08 }}
              >
                <BiRefresh
                  className={cn(
                    "h-5 w-5 transition-colors duration-150",
                    ready || refreshing
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
              </motion.div>
            </motion.div>

            <motion.span
              key={refreshing ? "refreshing" : ready ? "ready" : "pull"}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-full border bg-background/90 px-2 py-0.5 shadow-sm backdrop-blur-sm",
                "text-[10px] font-medium",
                ready || refreshing ? "text-primary" : "text-muted-foreground",
              )}
            >
              {refreshing
                ? "Refreshing…"
                : ready
                  ? "Release to refresh"
                  : "Pull to refresh"}
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
