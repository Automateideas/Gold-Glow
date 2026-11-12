import { Leaf, ShieldCheck, Sparkles, Heart, FlaskConical, Store } from "lucide-react";

const items = [
  { icon: Leaf, label: "Herbal Ingredients" },
  { icon: ShieldCheck, label: "Dermatologically Tested" },
  { icon: Heart, label: "Cruelty-Free" },
  { icon: Sparkles, label: "Paraben-Free" },
  { icon: FlaskConical, label: "Skin-Friendly pH" },
  { icon: Store, label: "On Amazon · Flipkart · Meesho" },
];

export function MarqueeStrip() {
  const loop = [...items, ...items];
  return (
    <div className="border-y bg-background py-4">
      <div className="relative overflow-hidden">
        <div className="marquee-track gap-10 pr-10">
          {loop.map((item, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-2.5 text-sm font-medium text-muted-foreground"
            >
              <item.icon className="h-4 w-4 text-primary" />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
