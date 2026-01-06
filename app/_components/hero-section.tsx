import type React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ShoppingBag, TrendingUp } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-primary),transparent)]/10" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-muted-foreground">Now in production</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
              Master Your E-Commerce Empire
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
              The most powerful admin platform to manage products, track sales,
              analyze customer behavior, and scale your online store with
              confidence.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href={'/products'}>
              <Button size="lg" className="group" >
                Get Started 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-background bg-muted"
                    />
                  ))}
                </div>
                <span>2,500+ stores</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span>No credit card required</span>
            </div>
          </div>

          {/* Right side - Dashboard Preview */}
          <div className="relative lg:ml-auto">
            <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-3xl" />
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Dashboard Overview
        </h3>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={<ShoppingBag className="h-4 w-4" />}
          label="Total Sales"
          value="$48.2K"
          change="+12.5%"
          positive
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Orders"
          value="1,429"
          change="+8.2%"
          positive
        />
        <StatCard
          icon={<BarChart3 className="h-4 w-4" />}
          label="Conversion"
          value="3.24%"
          change="+2.1%"
          positive
        />
      </div>

      {/* Chart Preview */}
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <div className="mb-2 text-xs font-medium text-muted-foreground">
          Revenue Overview
        </div>
        <div className="flex h-32 items-end justify-between gap-2">
          {[40, 65, 45, 80, 60, 90, 70, 85, 55, 75, 95, 70].map((height, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-primary/80 transition-all hover:bg-primary"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 space-y-1">
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
      <div
        className={`text-xs font-medium ${
          positive ? "text-primary" : "text-destructive"
        }`}
      >
        {change}
      </div>
    </div>
  );
}
