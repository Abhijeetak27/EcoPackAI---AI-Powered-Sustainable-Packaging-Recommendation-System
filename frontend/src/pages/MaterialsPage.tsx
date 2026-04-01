import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Database, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { materialCategories, type PackagingMaterial } from "@/data/materials";
import { useCompare } from "@/contexts/CompareContext";
import { useToast } from "@/hooks/use-toast";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

function MaterialDetailModal({ material, onClose }: { material: PackagingMaterial; onClose: () => void }) {
  const radarData = [
    { attr: "Cost Eff.", val: Math.max(0, 100 - material.costPerUnit * 2.5) },
    { attr: "Strength", val: material.strength * 10 },
    { attr: "Biodeg.", val: material.biodegradabilityScore },
    { attr: "Low CO₂", val: Math.max(0, 100 - material.co2Score * 100) },
    { attr: "Recyclable", val: material.recyclability },
    { attr: "Wt. Cap.", val: Math.min(100, material.weightCapacity * 2) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">{material.name}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{material.description}</p>
        <div className="eco-badge-green mb-4">{material.type}</div>
        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          {[
            ["Biodegradability", `${material.biodegradabilityScore}%`],
            ["CO₂ Score", `${material.co2Score} kg`],
            ["Cost", `₹${material.costPerUnit}`],
            ["Strength", `${material.strength}/10`],
            ["Recyclability", `${material.recyclability}%`],
            ["Weight Capacity", `${material.weightCapacity} kg`],
            ["Water Resistance", `${material.waterResistance}/10`],
            ["Shelf Life", `${material.shelfLife} months`],
          ].map(([l, v]) => (
            <div key={l} className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{l}</p>
              <p className="font-semibold font-mono text-foreground">{v}</p>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Suitable for:</p>
          <div className="flex flex-wrap gap-1">
            {material.suitableFor.map(s => <span key={s} className="eco-badge-green text-xs">{s}</span>)}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(153 15% 82%)" />
            <PolarAngleAxis dataKey="attr" tick={{ fontSize: 10, fill: "hsl(153 15% 40%)" }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
            <Radar dataKey="val" stroke="#2D6A4F" fill="#2D6A4F" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<PackagingMaterial[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [costRange, setCostRange] = useState([0, 40]);
  const [co2Range, setCo2Range] = useState([0, 1]);
  const [minBio, setMinBio] = useState([0]);
  const [page, setPage] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState<PackagingMaterial | null>(null);
  const [sortKey, setSortKey] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const { addToCompare, isInCompare } = useCompare();
  const { toast } = useToast();
  const perPage = 10;

  useEffect(() => {
    fetch("/api/materials")
      .then((r) => r.json())
      .then(setMaterials)
      .catch(() => toast({ title: "Failed to load materials", variant: "destructive" }))
      .finally(() => setFetchLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = materials.filter(m => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(m.type)) return false;
      if (m.costPerUnit < costRange[0] || m.costPerUnit > costRange[1]) return false;
      if (m.co2Score < co2Range[0] || m.co2Score > co2Range[1]) return false;
      if (m.biodegradabilityScore < minBio[0]) return false;
      return true;
    });
    list.sort((a, b) => {
      const av = (a as any)[sortKey];
      const bv = (b as any)[sortKey];
      const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [search, selectedTypes, costRange, co2Range, minBio, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  if (fetchLoading) {
    return (
      <div className="eco-section">
        <div className="eco-container text-center">
          <p className="text-muted-foreground">Loading materials…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="eco-section">
      <div className="eco-container">
        <h1 className="text-3xl font-bold text-foreground mb-2">Material Database Explorer</h1>
        <p className="text-muted-foreground mb-8">Browse and filter {materials.length} eco-friendly packaging materials.</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="lg:w-64 shrink-0 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search materials..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
            </div>
            <div>
              <Label className="text-xs font-medium">Material Type</Label>
              <div className="space-y-2 mt-2">
                {materialCategories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={selectedTypes.includes(cat)}
                      onCheckedChange={checked => {
                        setSelectedTypes(prev => checked ? [...prev, cat] : prev.filter(t => t !== cat));
                        setPage(1);
                      }}
                    />
                    <span className="text-foreground">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium">Cost Range: ₹{costRange[0]} - ₹{costRange[1]}</Label>
              <Slider min={0} max={40} step={1} value={costRange} onValueChange={v => { setCostRange(v); setPage(1); }} className="mt-2" />
            </div>
            <div>
              <Label className="text-xs font-medium">CO₂ Range: {co2Range[0]} - {co2Range[1]} kg</Label>
              <Slider min={0} max={1} step={0.05} value={co2Range} onValueChange={v => { setCo2Range(v); setPage(1); }} className="mt-2" />
            </div>
            <div>
              <Label className="text-xs font-medium">Min Biodegradability: {minBio[0]}%</Label>
              <Slider min={0} max={100} step={5} value={minBio} onValueChange={v => { setMinBio(v); setPage(1); }} className="mt-2" />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1">
            <div className="eco-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      { key: "name", label: "Name" },
                      { key: "type", label: "Type" },
                      { key: "biodegradabilityScore", label: "Biodeg. %" },
                      { key: "co2Score", label: "CO₂" },
                      { key: "costPerUnit", label: "Cost (₹)" },
                      { key: "strength", label: "Strength" },
                      { key: "recyclability", label: "Recycle %" },
                      { key: "weightCapacity", label: "Wt. Cap." },
                    ].map(col => (
                      <th
                        key={col.key}
                        className="p-3 text-left text-xs text-muted-foreground font-medium cursor-pointer hover:text-foreground select-none"
                        onClick={() => toggleSort(col.key)}
                      >
                        {col.label} {sortKey === col.key ? (sortDir === "asc" ? "↑" : "↓") : ""}
                      </th>
                    ))}
                    <th className="p-3 text-xs text-muted-foreground">Compare</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map(m => (
                    <tr
                      key={m.id}
                      className="border-b border-border/30 hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => setSelectedMaterial(m)}
                    >
                      <td className="p-3 font-medium text-foreground">{m.name}</td>
                      <td className="p-3"><span className="eco-badge-green text-xs">{m.type}</span></td>
                      <td className="p-3 font-mono text-foreground">{m.biodegradabilityScore}%</td>
                      <td className="p-3 font-mono text-foreground">{m.co2Score}</td>
                      <td className="p-3 font-mono text-foreground">₹{m.costPerUnit}</td>
                      <td className="p-3 font-mono text-foreground">{m.strength}/10</td>
                      <td className="p-3 font-mono text-foreground">{m.recyclability}%</td>
                      <td className="p-3 font-mono text-foreground">{m.weightCapacity} kg</td>
                      <td className="p-3" onClick={e => e.stopPropagation()}>
                        <Checkbox
                          checked={isInCompare(m.id)}
                          onCheckedChange={checked => {
                            if (checked) { addToCompare(m); toast({ title: "Added", description: m.name }); }
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedMaterial && <MaterialDetailModal material={selectedMaterial} onClose={() => setSelectedMaterial(null)} />}
      </AnimatePresence>
    </div>
  );
}
