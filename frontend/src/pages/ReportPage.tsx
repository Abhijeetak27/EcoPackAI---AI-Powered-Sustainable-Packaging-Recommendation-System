import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, TreePine, Car, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { materials, productCategories } from "@/data/materials";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

export default function ReportPage() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [generated, setGenerated] = useState(false);
  const { toast } = useToast();

  const topMaterials = materials.sort((a, b) => b.biodegradabilityScore - a.biodegradabilityScore).slice(0, 5);
  const totalCo2Saved = topMaterials.reduce((s, m) => s + (0.8 - m.co2Score), 0) * 1000;
  const totalCostSaved = topMaterials.reduce((s, m) => s + (30 - m.costPerUnit), 0) * 100;
  const treesEquiv = Math.round(totalCo2Saved / 21);
  const carsEquiv = Math.round(totalCo2Saved / 4600);
  const phonesEquiv = Math.round(totalCo2Saved / 0.008);

  const projectionData = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    co2Saved: Math.round(totalCo2Saved / 12 * (i + 1) * (0.9 + Math.random() * 0.2)),
    costSaved: Math.round(totalCostSaved / 12 * (i + 1) * (0.9 + Math.random() * 0.2)),
  }));

  const materialScores = topMaterials.map(m => ({
    name: m.name.split(" ").slice(0, 2).join(" "),
    biodeg: m.biodegradabilityScore,
    recycle: m.recyclability,
    ecoScore: Math.round(100 - m.co2Score * 100),
  }));

  const handleGenerate = () => {
    if (!companyName || !industry) {
      toast({ title: "Missing fields", description: "Please fill in company name and industry.", variant: "destructive" });
      return;
    }
    setGenerated(true);
    toast({ title: "Report Generated", description: "Your sustainability report is ready!" });
  };

  return (
    <div className="eco-section">
      <div className="eco-container max-w-5xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Sustainability Report Generator</h1>
        <p className="text-muted-foreground mb-8">Generate a comprehensive sustainability report for your organization.</p>

        {!generated ? (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="eco-card p-8 max-w-xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-eco-leaf" />
              <h2 className="text-xl font-semibold text-foreground">Report Parameters</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <Input placeholder="e.g., GreenCorp Industries" value={companyName} onChange={e => setCompanyName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>{productCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerate} className="w-full bg-primary text-primary-foreground">
                Generate Report <FileText className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            {/* Report header */}
            <div className="eco-card p-8 mb-6 text-center bg-primary text-primary-foreground">
              <h2 className="text-2xl font-bold mb-1">Sustainability Impact Report</h2>
              <p className="opacity-80">{companyName} • {industry} • 2026</p>
            </div>

            {/* Executive Summary */}
            <div className="eco-card p-6 mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Executive Summary</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                By adopting EcoPackAI&apos;s recommended sustainable packaging materials, <strong className="text-foreground">{companyName}</strong> can
                achieve an estimated <strong className="text-eco-leaf">{Math.round(totalCo2Saved)} kg CO₂ reduction</strong> annually
                and save approximately <strong className="text-eco-leaf">₹{Math.round(totalCostSaved).toLocaleString()}</strong> in
                packaging costs. The analysis evaluated {materials.length} eco-friendly materials across biodegradability,
                recyclability, cost, and carbon footprint metrics.
              </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="eco-stat-card items-center text-center">
                <TreePine className="w-8 h-8 text-eco-leaf" />
                <p className="text-2xl font-bold font-mono text-foreground">{treesEquiv}</p>
                <p className="text-xs text-muted-foreground">Trees Equivalent</p>
              </div>
              <div className="eco-stat-card items-center text-center">
                <Car className="w-8 h-8 text-eco-leaf" />
                <p className="text-2xl font-bold font-mono text-foreground">{carsEquiv}</p>
                <p className="text-xs text-muted-foreground">Cars Removed/Year</p>
              </div>
              <div className="eco-stat-card items-center text-center">
                <Smartphone className="w-8 h-8 text-eco-leaf" />
                <p className="text-2xl font-bold font-mono text-foreground">{phonesEquiv.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Phone Charges Equiv.</p>
              </div>
              <div className="eco-stat-card items-center text-center">
                <FileText className="w-8 h-8 text-eco-leaf" />
                <p className="text-2xl font-bold font-mono text-foreground">{topMaterials.length}</p>
                <p className="text-xs text-muted-foreground">Materials Analyzed</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="eco-card p-6">
                <h3 className="font-semibold text-foreground mb-4">CO₂ Reduction Projection</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(153 15% 82%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(153 15% 40%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(153 15% 40%)" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="co2Saved" name="CO₂ Saved (kg)" stroke="#2D6A4F" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="eco-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Material Sustainability Scores</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={materialScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(153 15% 82%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(153 15% 40%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(153 15% 40%)" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="biodeg" name="Biodeg." fill="#1B4332" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="recycle" name="Recycle" fill="#2D6A4F" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="ecoScore" name="Eco Score" fill="#40916C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top materials table */}
            <div className="eco-card p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">Recommended Materials</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left text-muted-foreground">Material</th>
                      <th className="p-3 text-center text-muted-foreground">Biodeg.</th>
                      <th className="p-3 text-center text-muted-foreground">CO₂</th>
                      <th className="p-3 text-center text-muted-foreground">Cost</th>
                      <th className="p-3 text-center text-muted-foreground">Recyclability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMaterials.map(m => (
                      <tr key={m.id} className="border-b border-border/30">
                        <td className="p-3 font-medium text-foreground">{m.name}</td>
                        <td className="p-3 text-center font-mono text-foreground">{m.biodegradabilityScore}%</td>
                        <td className="p-3 text-center font-mono text-foreground">{m.co2Score} kg</td>
                        <td className="p-3 text-center font-mono text-foreground">₹{m.costPerUnit}</td>
                        <td className="p-3 text-center font-mono text-foreground">{m.recyclability}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setGenerated(false)}>Generate New Report</Button>
              <Button className="bg-primary text-primary-foreground" onClick={() => {
                window.print();
                toast({ title: "Print dialog opened", description: "Use 'Save as PDF' to export." });
              }}>
                <Download className="w-4 h-4 mr-2" /> Export as PDF
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
