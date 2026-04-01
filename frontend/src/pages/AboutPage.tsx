import { motion } from "framer-motion";
import { Brain, Database, Server, Layout, BarChart3, Rocket, ArrowRight, Leaf } from "lucide-react";

const methodology = [
  { title: "Random Forest Regressor", desc: "Used for cost prediction. Ensemble of decision trees that averages predictions to reduce variance. Trained on material properties, volume, weight, and shipping parameters to predict optimal cost per unit.", color: "bg-primary" },
  { title: "XGBoost Regressor", desc: "Used for CO₂ footprint prediction. Gradient-boosted decision trees optimized for speed and performance. Uses material composition, manufacturing process data, and lifecycle factors to estimate carbon emissions.", color: "bg-secondary" },
  { title: "Weighted Scoring Algorithm", desc: "Combines ML predictions with user preferences using dynamic weights. Produces a composite suitability score factoring in eco-friendliness, cost efficiency, material strength, and product compatibility.", color: "bg-eco-leaf" },
];

const architecture = [
  { icon: Layout, label: "User Interface", desc: "React + TailwindCSS", color: "border-eco-leaf" },
  { icon: Server, label: "Backend API", desc: "Flask REST API", color: "border-accent" },
  { icon: Brain, label: "AI/ML Layer", desc: "Random Forest + XGBoost", color: "border-primary" },
  { icon: Database, label: "Database", desc: "PostgreSQL", color: "border-secondary" },
  { icon: BarChart3, label: "BI Dashboard", desc: "Recharts Analytics", color: "border-eco-leaf" },
  { icon: Rocket, label: "Deployment", desc: "Cloud Platform", color: "border-accent" },
];

const techStack = [
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Recharts", category: "Visualization" },
  { name: "Framer Motion", category: "Animation" },
  { name: "Flask", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "scikit-learn", category: "ML" },
  { name: "XGBoost", category: "ML" },
  { name: "Pandas", category: "Data" },
];

export default function AboutPage() {
  return (
    <div className="eco-section">
      <div className="eco-container max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="eco-badge-green mb-4 mx-auto w-fit">
            <Leaf className="w-3.5 h-3.5 mr-1.5" />
            About EcoPackAI
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How Our AI Works</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            EcoPackAI combines advanced machine learning with sustainability science to recommend
            optimal eco-friendly packaging materials for any product.
          </p>
        </motion.div>

        {/* AI Methodology */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">AI Methodology</h2>
          <div className="space-y-6">
            {methodology.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="eco-card p-6 flex gap-4"
              >
                <div className={`w-1 rounded-full ${m.color} shrink-0`} />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{m.title}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Architecture */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">System Architecture</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {architecture.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`eco-card p-6 text-center border-l-4 ${item.color}`}
              >
                <item.icon className="w-8 h-8 mx-auto mb-3 text-foreground" />
                <h3 className="font-semibold text-foreground text-sm">{item.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          {/* Flow arrows */}
          <div className="flex items-center justify-center gap-3 mt-6 text-muted-foreground">
            <span className="text-sm">User Input</span>
            <ArrowRight className="w-4 h-4" />
            <span className="text-sm">API</span>
            <ArrowRight className="w-4 h-4" />
            <span className="text-sm">ML Models</span>
            <ArrowRight className="w-4 h-4" />
            <span className="text-sm">Recommendations</span>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Technology Stack</h2>
          <div className="flex flex-wrap gap-3">
            {techStack.map(tech => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="eco-card px-4 py-2.5"
              >
                <p className="font-medium text-sm text-foreground">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.category}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team placeholder */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Project Lead", "ML Engineer", "Full-Stack Dev", "UI/UX Designer"].map((role, i) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="eco-card p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <p className="font-medium text-foreground text-sm">Team Member</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
