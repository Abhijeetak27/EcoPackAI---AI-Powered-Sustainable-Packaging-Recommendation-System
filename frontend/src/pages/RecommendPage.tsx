import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Leaf, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { productCategories, type ProductCategory } from "@/data/materials";
import type { ProductInput, SustainabilityPreferences, RecommendationResult } from "@/lib/recommendation-engine";
import { useCompare } from "@/contexts/CompareContext";
import { useToast } from "@/hooks/use-toast";

function CircularProgress({ value, size = 64 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? "hsl(145 50% 42%)" : value >= 40 ? "hsl(40 80% 50%)" : "hsl(0 84% 60%)";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={4} fill="none" className="stroke-muted" />
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={4} fill="none" stroke={color}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <span className="absolute text-xs font-bold text-foreground">{value}</span>
    </div>
  );
}

function Co2Indicator({ value }: { value: number }) {
  const level = value < 0.5 ? "green" : value < 1.5 ? "yellow" : "red";
  const colors = { green: "bg-eco-leaf/20 text-eco-leaf", yellow: "bg-yellow-100 text-yellow-700", red: "bg-red-100 text-red-700" };
  return (
    <span className={`eco-badge ${colors[level]}`}>
      {level === "green" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
      {value} kg
    </span>
  );
}

export default function RecommendPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { addToCompare, isInCompare } = useCompare();
  const [results, setResults] = useState<RecommendationResult[]>([]);

  const [product, setProduct] = useState<ProductInput>({
    name: "", category: "Electronics" as ProductCategory, weight: 2, length: 30, width: 20, height: 15, fragility: 5, shippingDistance: 500,
  });
  const [prefs, setPrefs] = useState<SustainabilityPreferences>({
    ecoVsCost: 60, minBiodegradability: 20, maxCo2: 5, requireRecyclable: false,
  });

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ product, preferences: prefs }),
      });
      if (!r.ok) throw new Error("Recommendation failed");
      setResults(await r.json());
      setStep(3);
    } catch {
      toast({ title: "Error", description: "Could not get recommendations. Is the backend running?", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eco-section">
      <div className="eco-container max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">AI Packaging Recommendations</h1>
          <p className="text-muted-foreground">Get personalized eco-friendly packaging suggestions powered by AI.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="eco-card p-8">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-eco-leaf" />
                <h2 className="text-xl font-semibold text-foreground">Product Details</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Product Name</Label>
                  <Input placeholder="e.g., Wireless Headphones" value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={product.category} onValueChange={v => setProduct({ ...product, category: v as ProductCategory })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{productCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <Input type="number" min={0.1} step={0.1} value={product.weight} onChange={e => setProduct({ ...product, weight: +e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Shipping Distance (km)</Label>
                  <Input type="number" min={1} value={product.shippingDistance} onChange={e => setProduct({ ...product, shippingDistance: +e.target.value })} className="mt-1" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>L (cm)</Label><Input type="number" value={product.length} onChange={e => setProduct({ ...product, length: +e.target.value })} className="mt-1" /></div>
                  <div><Label>W (cm)</Label><Input type="number" value={product.width} onChange={e => setProduct({ ...product, width: +e.target.value })} className="mt-1" /></div>
                  <div><Label>H (cm)</Label><Input type="number" value={product.height} onChange={e => setProduct({ ...product, height: +e.target.value })} className="mt-1" /></div>
                </div>
                <div>
                  <Label>Fragility Level: {product.fragility}/10</Label>
                  <Slider min={1} max={10} step={1} value={[product.fragility]} onValueChange={([v]) => setProduct({ ...product, fragility: v })} className="mt-3" />
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <Button onClick={() => setStep(2)} className="bg-primary text-primary-foreground">
                  Next: Preferences <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="eco-card p-8">
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="w-5 h-5 text-eco-leaf" />
                <h2 className="text-xl font-semibold text-foreground">Sustainability Preferences</h2>
              </div>
              <div className="space-y-8">
                <div>
                  <Label>Cost Efficiency vs Eco-Friendliness: {prefs.ecoVsCost}% Eco</Label>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>Cost Priority</span><span>Eco Priority</span></div>
                  <Slider min={0} max={100} step={5} value={[prefs.ecoVsCost]} onValueChange={([v]) => setPrefs({ ...prefs, ecoVsCost: v })} className="mt-2" />
                </div>
                <div>
                  <Label>Minimum Biodegradability: {prefs.minBiodegradability}%</Label>
                  <Slider min={0} max={100} step={5} value={[prefs.minBiodegradability]} onValueChange={([v]) => setPrefs({ ...prefs, minBiodegradability: v })} className="mt-2" />
                </div>
                <div>
                  <Label>Maximum CO₂ Footprint: {prefs.maxCo2} kg CO₂/unit</Label>
                  <Slider min={0.5} max={10} step={0.5} value={[prefs.maxCo2]} onValueChange={([v]) => setPrefs({ ...prefs, maxCo2: v })} className="mt-2" />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={prefs.requireRecyclable} onCheckedChange={c => setPrefs({ ...prefs, requireRecyclable: !!c })} />
                  <Label>Require recyclable materials (≥50%)</Label>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                <Button onClick={handleRecommend} disabled={loading} className="bg-eco-leaf hover:bg-eco-leaf/90 text-primary-foreground">
                  {loading ? "Analyzing…" : <><span>Get AI Recommendations</span><ArrowRight className="w-4 h-4 ml-2" /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Top Recommendations for "{product.name || "Your Product"}"</h2>
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Start Over
                </Button>
              </div>
              <div className="space-y-4">
                {results.map((r, i) => (
                  <motion.div
                    key={r.material.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="eco-card p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative">
                          {i === 0 && <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">★</div>}
                          <CircularProgress value={r.suitabilityScore} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{r.material.name}</h3>
                          <p className="text-sm text-muted-foreground">{r.material.type} • {r.material.description.slice(0, 80)}...</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
                        <div><p className="text-muted-foreground text-xs">Cost</p><p className="font-semibold font-mono text-foreground">₹{r.predictedCost}</p></div>
                        <div><p className="text-muted-foreground text-xs">CO₂</p><Co2Indicator value={r.predictedCo2} /></div>
                        <div><p className="text-muted-foreground text-xs">Biodeg.</p><p className="font-semibold text-foreground">{r.material.biodegradabilityScore}%</p></div>
                        <div><p className="text-muted-foreground text-xs">Recycle</p><p className="font-semibold text-foreground">{r.material.recyclability}%</p></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isInCompare(r.material.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              addToCompare(r.material);
                              toast({ title: "Added to comparison", description: r.material.name });
                            }
                          }}
                        />
                        <span className="text-xs text-muted-foreground">Compare</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
