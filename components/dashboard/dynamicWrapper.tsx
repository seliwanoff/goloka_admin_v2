"use client";

import { useEffect, useState } from "react";

interface DynamicChartProps {
  children: React.ReactNode;
}

export const DynamicChart = ({ children }: DynamicChartProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading placeholder
  }

  return <>{children}</>;
};
