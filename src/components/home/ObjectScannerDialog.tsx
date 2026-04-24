import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/UI/dialog";
import { Camera, X, Leaf, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { analyzeImageWithGemini, ScanResult } from "@/lib/gemini";
import { useTranslations, Text } from "@fimo/ui";
import { updateUserProgress } from "@/utils/gamification";
import EcoScoreDisplay from "./EcoScoreDisplay";

interface ObjectScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ObjectScannerDialog({ open, onOpenChange }: ObjectScannerDialogProps) {
  const { t } = useTranslations();
  const [status, setStatus] = useState<"idle" | "capturing" | "result" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [xpGained, setXpGained] = useState<number>(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    if (streamRef.current) return;
    try {
      // First try to get the rear camera
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(e => console.error("Play error:", e));
      }
    } catch (err) {
      // Fallback to any available camera (often fixes desktop issues)
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play().catch(e => console.error("Play error:", e));
        }
      } catch (fallbackErr) {
        console.error("Camera access failed entirely:", fallbackErr);
        setStatus("error");
        setErrorMessage("Camera access denied or unavailable. Please check your browser permissions.");
      }
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (open && status === "idle") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [open, status, stopCamera]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setStatus("capturing");

    // Draw video frame to canvas
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL("image/jpeg", 0.8);

    try {
      const analysis = await analyzeImageWithGemini(base64Image);
      const updated = updateUserProgress(analysis.ecoScore);
      const clamped = Math.max(0, Math.min(100, analysis.ecoScore));
      setXpGained(clamped < 40 ? -Math.round((40 - clamped) * 1.5) : Math.round(clamped * 1.5));
      setResult(analysis);
      setStatus("result");
    } catch (error: any) {
      console.error("Failed to analyze image:", error);
      setStatus("error");
      setErrorMessage(error.message || "We couldn't analyze this image. Please try again.");
    }
  };

  const handleReset = () => {
    setResult(null);
    setErrorMessage("");
    setStatus("idle");
  };

  // Close completely
  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      handleReset();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent showCloseButton={false} className="max-w-2xl bg-[#0F0F12] border-emerald-900/40 p-0 overflow-hidden shadow-2xl">
        <DialogTitle className="sr-only">Object Scanner Modal</DialogTitle>
        <DialogDescription className="sr-only">Identify environmental impact by scanning an object</DialogDescription>
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2 text-emerald-400">
            <Camera className="w-5 h-5" />
            <span className="font-bold text-lg"><Text value={t("scanner.title", "Object Scanner")} /></span>
          </div>
          <button onClick={handleClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`relative min-h-[400px] max-h-[85vh] overflow-y-auto overflow-x-hidden w-full flex flex-col bg-black/60 scrollbar-thin scrollbar-thumb-white/10 ${status !== 'result' ? 'items-center justify-center' : ''}`}>
          <canvas ref={canvasRef} className="hidden" />

          {status === "idle" && (
            <div className="relative w-full h-full flex flex-col items-center">
              <div className="relative w-full aspect-video md:aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover opacity-80"
                />
                
                {/* Viewfinder Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative w-full h-full max-w-[280px] max-h-[280px]">
                    {/* Viewfinder corners */}
                    <div className="absolute left-0 top-0 h-10 w-10 border-l-[3px] border-t-[3px] border-emerald-400 rounded-tl-xl" />
                    <div className="absolute right-0 top-0 h-10 w-10 border-r-[3px] border-t-[3px] border-emerald-400 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 h-10 w-10 border-b-[3px] border-l-[3px] border-emerald-400 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 h-10 w-10 border-b-[3px] border-r-[3px] border-emerald-400 rounded-br-xl" />
                    
                    {/* Scan line */}
                    <motion.div
                      className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 w-full bg-[#1A1A1E]">
                <button 
                  onClick={handleCapture}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 px-6 rounded-xl transition-all"
                >
                  <Camera className="w-5 h-5" />
                  <Text value={t("scanner.captureBtn", "Capture & Analyze")} />
                </button>
              </div>
            </div>
          )}

          {status === "capturing" && (
            <div className="p-12 flex flex-col items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-12 h-12 text-emerald-400 mb-6" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">Analyzing Image...</h3>
              <p className="text-white/60 text-center max-w-sm">
                Our AI is evaluating the environmental impact of your item.
              </p>
            </div>
          )}

          {status === "result" && result && (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full p-6 flex flex-col gap-6 bg-[#0B0B0E]"
              >
                <div className="flex items-start justify-between">
                  <div className="pr-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-emerald-400 leading-tight mb-2">
                      {result.title}
                    </h2>
                    <p className="text-[#a0a0ab] leading-relaxed">
                      {result.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <EcoScoreDisplay score={result.ecoScore} xpGained={xpGained} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {result.suggestions.map((sug, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                      <Leaf className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-white/80 leading-relaxed">
                        {sug}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={handleReset}
                    className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                  >
                    Scan another item
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {status === "error" && (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
              <p className="text-white/60 text-center max-w-sm mb-6">
                {errorMessage}
              </p>
              <button 
                onClick={handleReset}
                className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
