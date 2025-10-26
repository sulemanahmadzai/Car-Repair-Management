"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export interface ChartConfig extends Record<string, any> {
  chartContainerClassName?: string;
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      data-chart-container={id}
      data-chart-variant={config.variant}
      className={cn(
        "flex justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-curtain]:fill-muted/50 [&_.recharts-reference-line-line[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-xAxis .recharts-cartesian-axis-ticks]:translate-x-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      nameKey?: string;
      labelKey?: string;
      active?: boolean;
      payload?: any[];
      indicator?: "dot" | "line";
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      nameKey,
      labelKey,
      ...props
    },
    ref
  ) => {
    const payloadData = payload?.[0]?.payload;

    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-card px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
        {...props}
      >
        {payloadData && labelKey && (
          <div className="grid gap-1.5 border-b border-border/50 pb-1.5">
            {payloadData[labelKey]}
          </div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${
              nameKey || item.name || item.dataKey || "value"
            }-${index}`;
            return (
              <div
                key={key}
                className="flex w-full flex-wrap items-stretch gap-2.5 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground"
              >
                {indicator === "dot" && (
                  <div
                    className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />
                )}
                <span className="flex-1 text-muted-foreground">
                  {nameKey || item.name || item.dataKey}
                </span>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {typeof item.value === "number"
                    ? item.value.toLocaleString()
                    : item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

export const ChartLegend = RechartsPrimitive.Legend;

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload?: any[];
    verticalAlign?: "top" | "bottom";
    nameKey?: string;
  }
>(
  (
    {
      className,
      payload,
      verticalAlign = "bottom",
      nameKey = "value",
      ...props
    },
    ref
  ) => {
    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
        {...props}
      >
        {payload.map((item) => (
          <div
            key={item.dataKey}
            className={cn("group inline-flex items-center gap-1.5")}
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: item.color,
              }}
            />
            {nameKey in item ? (
              <span className="text-xs text-muted-foreground">
                {item[nameKey]}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                {item.dataKey}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";
