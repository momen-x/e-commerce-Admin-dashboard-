import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Bell,
  Shield,
  Zap,
  Globe,
  CreditCard,
  LineChart,
  Settings,
  Layers,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Real-time insights into sales, traffic, and customer behavior with beautiful visualizations.",
  },
  {
    icon: Package,
    title: "Inventory Management",
    description:
      "Track stock levels, manage variants, and automate reordering across multiple warehouses.",
  },
  {
    icon: Users,
    title: "Customer Intelligence",
    description:
      "Deep customer profiles with purchase history, preferences, and predictive analytics.",
  },
  {
    icon: ShoppingCart,
    title: "Order Processing",
    description:
      "Streamline fulfillment with automated workflows, shipping integrations, and tracking.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Stay informed with customizable alerts for sales, inventory, and customer actions.",
  },
  {
    icon: Shield,
    title: "Security First",
    description:
      "Enterprise-grade security with encryption, backups, and compliance certifications.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized performance to handle thousands of products and orders without lag.",
  },
  {
    icon: Globe,
    title: "Multi-Store",
    description:
      "Manage multiple stores and brands from a single, unified dashboard.",
  },
  {
    icon: CreditCard,
    title: "Payment Processing",
    description:
      "Accept payments worldwide with support for 100+ payment methods and currencies.",
  },
  {
    icon: LineChart,
    title: "Revenue Forecasting",
    description:
      "AI-powered predictions to help you plan inventory and marketing strategies.",
  },
  {
    icon: Settings,
    title: "Easy Integration",
    description:
      "Connect with your existing tools via API or pre-built integrations.",
  },
  {
    icon: Layers,
    title: "Custom Workflows",
    description:
      "Build automated workflows tailored to your unique business processes.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold text-primary">
            Everything You Need
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
            Built for modern e-commerce teams
          </p>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            Powerful features that grow with your business, from startup to
            enterprise scale.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border transition-all hover:shadow-lg hover:border-primary/50"
            >
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
