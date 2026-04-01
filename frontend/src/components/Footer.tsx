import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="eco-container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-eco-leaf" />
            <span className="font-bold text-foreground">EcoPackAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 EcoPackAI. Sustainable by design.
          </p>
        </div>
      </div>
    </footer>
  );
}
