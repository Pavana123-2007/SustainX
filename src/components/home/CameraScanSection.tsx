import { useState } from "react";
import { Camera, Recycle, Scan } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations, Text } from "@fimo/ui";
import { Badge } from "@/components/ui/badge";
import ObjectScannerDialog from "./ObjectScannerDialog";
import XPBar from "./XPBar";

const DETECTION_LABELS = [
  { label: "Plastic Bottle", x: "18%", y: "30%", color: "border-primary text-primary" },
  { label: "Food Container", x: "55%", y: "50%", color: "border-accent text-accent" },
  { label: "Vehicle", x: "35%", y: "72%", color: "border-destructive text-destructive" },
];

export default function CameraScanSection() {
  const { t } = useTranslations();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  return (
    <section id="camera" className="relative px-6 py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        {/* Left – text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-4 bg-accent/15 text-accent">
            <Camera className="mr-1 h-3 w-3" />
            <Text value={t("camera.badge", "Camera Mode")} />
          </Badge>
          <h2
            className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Text value={t("camera.title", "Point. Scan. Know Your Impact.")} />
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            <Text
              value={t(
                "camera.description",
                "Use your camera to scan everyday objects and instantly see their environmental footprint."
              )}
            />
          </p>
          <div className="mt-6 max-w-sm">
            <XPBar />
          </div>
        </motion.div>

        {/* Right – mock camera */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary/40">
            {/* Viewfinder corners */}
            <div className="absolute inset-4">
              <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-primary" />
              <div className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-primary" />
              <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-primary" />
            </div>

            {/* Scan line */}
            <motion.div
              className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
              animate={{ top: ["10%", "85%", "10%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Detection labels */}
            {DETECTION_LABELS.map((det, i) => (
              <motion.div
                key={det.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.2 }}
                className={`absolute rounded-lg border bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm ${det.color}`}
                style={{ left: det.x, top: det.y }}
              >
                {det.label}
              </motion.div>
            ))}

            {/* Center crosshair */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-10 w-10 rounded-full border border-primary/50" />
              <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
            </div>

            {/* Start Scanner Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-background/20 opacity-0 hover:opacity-100 transition-opacity backdrop-blur-[2px]">
              <button 
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-full transition-transform hover:scale-105"
              >
                <Scan className="w-5 h-5" />
                <Text value={t("camera.start", "Start Camera Scanner")} />
              </button>
            </div>
          </div>

          {/* Impact result card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-card/80 p-4 backdrop-blur-sm"
          >
            <Recycle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                <Text value={t("camera.impact", "Impact: 0.5 kg CO₂")} />
              </p>
              <p className="text-xs text-muted-foreground">
                <Text value={t("camera.suggestion", "Use a reusable bottle instead")} />
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <ObjectScannerDialog 
        open={isScannerOpen} 
        onOpenChange={setIsScannerOpen} 
      />
    </section>
  );
}