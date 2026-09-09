import { motion } from "framer-motion";
import { Eye, FileDown, History } from "lucide-react";
import { useWorkspace } from "@/workspace/store";
import { getHotel } from "@/lib/hotels";
import { generateQuotePdf } from "@/lib/quote-pdf";
import { cn } from "@/lib/utils";

const btn =
  "flex size-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-desk transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:hover:bg-surface";
const activeBtn =
  "bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground";

interface Props {
  preview: boolean;
  onTogglePreview: () => void;
  history: boolean;
  onToggleHistory: () => void;
}

export function QuoteToolbar({ preview, onTogglePreview, history, onToggleHistory }: Props) {
  const { quote, hotelLogos, archiveQuote, resetQuote } = useWorkspace();
  const selected = quote.hotelId ? getHotel(quote.hotelId) : null;

  const download = () => {
    if (!selected) return;
    archiveQuote();
    generateQuotePdf(quote, selected, hotelLogos[quote.hotelId] ?? selected.logoUrl);
    // Fresh blank form, ready for the next quotation.
    resetQuote();
  };

  const buttons = [
    {
      key: "preview",
      icon: Eye,
      label: "Preview quotation",
      disabled: !selected,
      onClick: onTogglePreview,
      active: preview,
    },
    {
      key: "download",
      icon: FileDown,
      label: "Download PDF",
      disabled: !selected,
      onClick: download,
      active: false,
    },
    {
      key: "history",
      icon: History,
      label: "Quote history",
      disabled: false,
      onClick: onToggleHistory,
      active: history,
    },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {buttons.map((b, index) => (
        <motion.button
          key={b.key}
          type="button"
          aria-label={b.label}
          disabled={b.disabled}
          onClick={b.onClick}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.04 }}
          className={cn(btn, b.active && activeBtn)}
        >
          <b.icon className="size-[14px]" />
        </motion.button>
      ))}
    </div>
  );
}
