import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations, Text } from "@fimo/ui";
import { Button } from "@/components/UI/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/UI/dialog";

interface ComingSoonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ComingSoonDialog({ open, onOpenChange }: ComingSoonDialogProps) {
  const { t } = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md text-center">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-4 py-4"
            >
              <div className="rounded-full bg-primary/20 p-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <DialogHeader className="items-center">
                <DialogTitle className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  <Text value={t("comingSoon.title", "Coming Soon")} />
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-base">
                  <Text
                    value={t(
                      "comingSoon.description",
                      "We're working hard to bring this feature to life. Stay tuned for updates!"
                    )}
                  />
                </DialogDescription>
              </DialogHeader>
              <Button onClick={() => onOpenChange(false)} className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Text value={t("comingSoon.gotIt", "Got it")} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}