import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const benefits = [
  "Free 14-day trial",
  "No credit card required",
  "Cancel anytime",
  "24/7 support included",
];

export function CtaSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_bottom,var(--color-primary),transparent)]/20" />
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
          Ready to transform your e-commerce business?
        </h2>
        <p className="mt-6 text-lg text-muted-foreground text-pretty">
          Join thousands of merchants who trust our platform to power their
          online stores. Start your  trial today.
        </p>

        <div className="mt-10 flex flex-col items-center gap-6">
          <Button size="lg" className="group px-8">
            Start  Trial
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground">5min</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Average setup time
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">150+</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Integrations available
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground">4.9/5</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Customer satisfaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
