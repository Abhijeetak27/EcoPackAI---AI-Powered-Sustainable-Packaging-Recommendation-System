import { useState } from "react";
import { motion } from "framer-motion";
import { materials, materialCategories } from "@/data/materials";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { TrendingDown, DollarSign, Leaf, Award } from "lucide-react";

const COLORS = ["#1B4332", "#2D6A4F", "#E76F51", "#40916C", "#95D5B2"];

function KpiCard({ icon: Icon, label, value, trend }: { icon: any; label: string; value: string; trend?: string }) {
  return (
    <div className="eco-stat-card">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-eco-leaf/10 flex items-center justify-center"><Icon className="w-5 h-5 text-eco-leaf" /></div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
      {trend && <p className="text-xs text-eco-leaf">{trend}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [threshold, setThreshold] = useState([50]);

  const filtered = categoryFilter === "All" ? materials : materials.filter(m => m.type === categoryFilter);

  const co2Data = filtered.map(m => ({ name: m.name.split(" ").slice(0, 2).join(" "), co2: m.co2Score })).sort((a, b) => b.co2 - a.co2);
  const scatterData = filtered.map(m => ({ name: m.name, cost: m.costPerUnit, co2: m.co2Score, type: m.type, z: m.biodegradabilityScore }));
  const pieData = materialCategories.map(cat => ({ name: cat, value: materials.filter(m => m.type === cat).length }));
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    savings: Math.round(120 + i * 45 + Math.random() * 30),
    baseline: Math.round(300 + Math.random() * 20),
  }));
  const top10 = [...filtered].sort((a, b) => b.biodegradabilityScore - a.biodegradabilityScore).slice(0, 10);
  const stackedData = filtered.slice(0, 12).map(m => ({
    name: m.name.split(" ").slice(0, 2).join(" "),
    raw: m.costBreakdown.rawMaterial,
    processing: m.costBreakdown.processing,
    shipping: m.costBreakdown.shipping,
  }));

  const avgCo2 = (filtered.reduce((s, m) => s + m.co2Score, 0) / filtered.length).toFixed(2);
  const avgCost = (filtered.reduce((s, m) => s + m.costPerUnit, 0) / filtered.length).toFixed(0);
  const topMat = [...filtered].sort((a, b) => b.biodegradabilityScore - a.biodegradabilityScore)[0];

  return (
    <div className="eco-section">
      <div className="eco-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">BI Analytics Dashboard</h1>
            <p className="text-muted-foreground">Sustainability insights across {materials.length} packaging materials.</p>
          </div>
          <div className="flex gap-3 items-end">
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  {materialCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Label className="text-xs">Sustainability ≥ {threshold[0]}%</Label>
              <Slider min={0} max={100} step={10} value={threshold} onValueChange={setThreshold} className="mt-2" />
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard icon={Leaf} label="Total Materials" value={filtered.length.toString()} />
          <KpiCard icon={TrendingDown} label="Avg CO₂ Score" value={`${avgCo2} kg`} trend="↓ 12% from baseline" />
          <KpiCard icon={DollarSign} label="Avg Cost" value={`₹${avgCost}`} trend="↓ 8% optimized" />
          <KpiCard icon={Award} label="Top Material" value={topMat?.name.split(" ").slice(0, 2).join(" ") || "N/A"} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="eco-card p-6">
            <h3 className="font-semibold text-foreground mb-4">CO₂ Emissions by Material</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={co2Data.slice(0, 15)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(153 15% 82%)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(153 15% 40%)" }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fill: "hsl(153 15% 40%)" }} />
                <Tooltip />
                <Bar dataKey="co2" fill="#2D6A4F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="eco-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Cost vs CO₂ Footprint</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(153 15% 82%)" />
                <XAxis dataKey="cost" name="Cost (₹)" tick={{ fontSize: 10, fill: "hsl(153 15% 40%)" }} />
                <YAxis dataKey="co2" name="CO₂" tick={{ fontSize: 10, fill: "hsl(153 15% 40%)" }} />
                <ZAxis dataKey="z" range={[40, 200]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(val: number, name: string) => [val, name]} />
                <Scatter data={scatterData} fill="#1B4332" />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="eco-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Material Distribution by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="eco-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Monthly CO₂ Savings Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(153 15% 82%)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(153 15% 40%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(153 15% 40%)" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="savings" name="CO₂ Saved (kg)" stroke="#2D6A4F" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#E76F51" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="eco-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Top 10 by Sustainability Score</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={top10.map(m => ({ name: m.name.split(" ").slice(0, 2).join(" "), score: m.biodegradabilityScore }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(153 15% 82%)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(153 15% 40%)" }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fill: "hsl(153 15% 40%)" }} />
                <Tooltip />
                <Bar dataKey="score" fill="#40916C" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="eco-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Cost Breakdown by Material</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stackedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(153 15% 82%)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(153 15% 40%)" }} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(153 15% 40%)" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="raw" name="Raw Material" stackId="a" fill="#1B4332" />
                <Bar dataKey="processing" name="Processing" stackId="a" fill="#2D6A4F" />
                <Bar dataKey="shipping" name="Shipping" stackId="a" fill="#E76F51" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
