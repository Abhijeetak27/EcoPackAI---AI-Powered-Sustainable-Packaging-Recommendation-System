import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, BarChart3, Package, Zap, Recycle, TrendingDown, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-packaging.jpg";

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-foreground font-mono">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

const steps = [
  { icon: Package, title: "Input Product", desc: "Enter product details like weight, dimensions, fragility, and shipping distance." },
  { icon: Zap, title: "AI Analyzes", desc: "Our ML algorithms evaluate 26+ materials using cost, CO₂, and suitability models." },
  { icon: Recycle, title: "Get Recommendations", desc: "Receive ranked eco-friendly packaging options with detailed sustainability metrics." },
];

const stats = [
  { value: 26, suffix: "+", label: "Eco Materials", icon: Package },
  { value: 45, suffix: "%", label: "Avg CO₂ Reduction", icon: TrendingDown },
  { value: 120, suffix: "+", label: "Companies Served", icon: Factory },
  { value: 30, suffix: "%", label: "Cost Savings", icon: BarChart3 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden eco-section pt-12 md:pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-eco-leaf/5" />
        <div className="eco-container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="eco-badge-green mb-4">
                <Leaf className="w-3.5 h-3.5 mr-1.5" />
                AI-Powered Sustainability
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
                Reduce packaging costs by{" "}
                <span className="eco-gradient-text">30%</span> while cutting CO₂ emissions
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                EcoPackAI uses machine learning to recommend optimal eco-friendly packaging materials based on your product attributes and sustainability goals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  <Link to="/recommend">
                    Get Recommendations
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:bg-muted">
                  <Link to="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-border">
                <img src={heroImage} alt="Sustainable packaging materials" width={1280} height={720} className="w-full h-auto" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-lg border border-border animate-pulse-green">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-eco-leaf" />
                  <span className="text-sm font-medium text-foreground">98% Biodegradable</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="eco-section bg-muted/30">
        <div className="eco-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Three simple steps to find your optimal sustainable packaging solution.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="eco-card p-8 text-center relative"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div className="w-14 h-14 rounded-xl bg-eco-leaf/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-eco-leaf" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="eco-section">
        <div className="eco-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-eco-leaf" />
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="eco-section bg-primary">
        <div className="eco-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to go green?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Join 120+ companies already using EcoPackAI to reduce their environmental impact.
            </p>
            <Button asChild size="lg" className="bg-eco-leaf hover:bg-eco-leaf/90 text-primary-foreground px-8">
              <Link to="/recommend">
                Start Now <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
