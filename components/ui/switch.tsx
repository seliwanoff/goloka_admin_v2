"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
      "data-[state=checked]:bg-[#EAEAEA]", // Background when checked
      "data-[state=unchecked]:bg-[#b3b2b2]", // Background when unchecked
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "inline-block h-6 w-6 transform rounded-full transition-transform",
        "data-[state=checked]:translate-x-5 data-[state=checked]:bg-[#3365E3]", // Ball when checked
        "data-[state=unchecked]:translate-x-1 data-[state=unchecked]:bg-[#EAEAEA]" // Ball when unchecked
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
