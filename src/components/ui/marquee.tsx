import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  speed?: number;
}

export function Marquee({
  children,
  pauseOnHover = false,
  direction = "left",
  speed = 30,
  className,
  ...props
}: MarqueeProps) {
  return (
    <div 
      className={cn(
        "w-full overflow-hidden sm:mt-10 mt-6 z-10",
        className
      )} 
      {...props}
    >
      <div className="relative flex max-w-full overflow-hidden py-5">
        <motion.div 
          className={cn(
            "flex w-max items-center gap-16",
            pauseOnHover && "hover:[animation-play-state:paused]"
          )}
          animate={{ x: direction === 'left' ? ["0%", "-50%"] : ["-50%", "0%"] }}
          transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        >
          {children}
          {children}
        </motion.div>
      </div>
    </div>
  );
}
