import { motion } from "framer-motion";
import { GitCompareArrows, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";
import { Link } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="eco-section">
        <div className="eco-container text-center">
          <GitCompareArrows className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">No Materials to Compare</h1>
          <p className="text-muted-foreground mb-6">Add materials from the Recommendations or Materials page.</p>
          <Button asChild className="bg-primary text-primary-foreground"><Link to="/recommend">Get Recommendations</Link></Button>
        </div>
      </div>
    );
  }

  const radarData = [
    { attr: "Cost Eff.", ...Object.fromEntries(compareList.map(m => [m.id, Math.max(0, 100 - m.costPerUnit * 2.5)])) },
    { attr: "Strength", ...Object.fromEntries(compareList.map(m => [m.id, m.strength * 10])) },
    { attr: "Biodeg.", ...Object.fromEntries(compareList.map(m => [m.id, m.biodegradabilityScore])) },
    { attr: "CO₂ Score", ...Object.fromEntries(compareList.map(m => [m.id, Math.max(0, 100 - m.co2Score * 100)])) },
    { attr: "Recyclable", ...Object.fromEntries(compareList.map(m => [m.id, m.recyclability])) },
    { attr: "Weight Cap.", ...Object.fromEntries(compareList.map(m => [m.id, Math.min(100, m.weightCapacity * 2)])) },
  ];

  const colors = ["#2D6A4F", "#E76F51", "#1B4332", "#64B5F6"];
  const bestScore = compareList.reduce((best, m) => {
    const score = m.biodegradabilityScore * 0.3 + m.recyclability * 0.2 + (100 - m.co2Score * 100) * 0.3 + (100 - m.costPerUnit * 2) * 0.2;
    return score > best.score ? { material: m, score } : best;
  }, { material: compareList[0], score: -Infinity });

  return (
    <div className="eco-section">
      <div className="eco-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Material Comparison</h1>
            <p className="text-muted-foreground">Comparing {compareList.length} material{compareList.length > 1 ? "s" : ""}</p>
          </div>
          <Button variant="outline" size="sm" onClick={clearCompare}><Trash2 className="w-4 h-4 mr-1" /> Clear All</Button>
        </div>

        {/* Winner */}
        {compareList.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eco-card p-6 mb-8 border-eco-leaf/30 bg-eco-leaf/5">
            <p className="text-sm font-medium text-eco-leaf">🏆 Best Overall</p>
            <p className="text-xl font-bold text-foreground">{bestScore.material.name}</p>
            <p className="text-sm text-muted-foreground">Highest combined score for sustainability, cost, and performance.</p>
          </motion.div>
        )}

        {/* Table */}
        <div className="eco-card overflow-x-auto mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left text-muted-foreground font-medium">Attribute</th>
                {compareList.map(m => (
                  <th key={m.id} className="p-4 text-center">
                    <div className="font-semibold text-foreground">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.type}</div>
                    <Button variant="ghost" size="sm" onClick={() => removeFromCompare(m.id)} className="mt-1 text-destructive h-6 text-xs">Remove</Button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Cost (₹/unit)", key: "costPerUnit" },
                { label: "CO₂ (kg/unit)", key: "co2Score" },
                { label: "Biodegradability", key: "biodegradabilityScore", suffix: "%" },
                { label: "Recyclability", key: "recyclability", suffix: "%" },
                { label: "Strength", key: "strength", suffix: "/10" },
                { label: "Weight Capacity", key: "weightCapacity", suffix: " kg" },
                { label: "Water Resistance", key: "waterResistance", suffix: "/10" },
              ].map(row => (
                <tr key={row.label} className="border-b border-border/50">
                  <td className="p-4 text-muted-foreground">{row.label}</td>
                  {compareList.map(m => (
                    <td key={m.id} className="p-4 text-center font-mono text-foreground">
                      {(m as any)[row.key]}{row.suffix || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="eco-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Radar Comparison</h3>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(153 15% 82%)" />
                <PolarAngleAxis dataKey="attr" tick={{ fontSize: 11, fill: "hsl(153 15% 40%)" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                {compareList.map((m, i) => (
                  <Radar key={m.id} name={m.name} dataKey={m.id} stroke={colors[i]} fill={colors[i]} fillOpacity={0.15} strokeWidth={2} />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="eco-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Cost & CO₂ Comparison</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={compareList.map(m => ({ name: m.name.split(" ").slice(0, 2).join(" "), cost: m.costPerUnit, co2: m.co2Score * 100 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(153 15% 82%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(153 15% 40%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(153 15% 40%)" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cost" name="Cost (₹)" fill="#2D6A4F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="co2" name="CO₂ Score" fill="#E76F51" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
