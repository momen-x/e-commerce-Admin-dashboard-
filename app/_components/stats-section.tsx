import { Package, Users, TrendingUp, DollarSign } from "lucide-react";

const stats = [
  {
    icon: Package,
    value: "10K+",
    label: "Products Managed",
    description: "Across all platforms",
  },
  {
    icon: Users,
    value: "2.5M",
    label: "Customer Records",
    description: "Securely stored",
  },
  {
    icon: TrendingUp,
    value: "99.9%",
    label: "Uptime Guarantee",
    description: "Always available",
  },
  {
    icon: DollarSign,
    value: "$2.4B",
    label: "Revenue Tracked",
    description: "In real-time",
  },
];

export function StatsSection() {
  return (
    <section className="border-y border-border bg-muted/30 px-6 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-4xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-foreground">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
