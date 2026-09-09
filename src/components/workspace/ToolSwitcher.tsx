import { motion } from "framer-motion";
import { useWorkspace } from "@/workspace/store";
import type { ToolId } from "@/workspace/types";
import { cn } from "@/lib/utils";

const TOOLS: { id: ToolId; label: string }[] = [
  { id: "notes", label: "Notes" },
  { id: "quote", label: "Quote" },
  { id: "rates", label: "Rates" },
];

export function ToolSwitcher() {
  const { activeTool, mode, openTool } = useWorkspace();

  return (
    <div className="relative flex items-center gap-1 rounded-full border border-border bg-surface p-1 shadow-desk">
      {TOOLS.map((t) => {
        const active = mode === "tool" && activeTool === t.id;
        return (
          <button
            key={t.id}
            onClick={() => openTool(t.id)}
            className="relative rounded-full px-4 py-1.5 text-[13px] font-medium tracking-wide"
          >
            {active && (
              <motion.div
                layoutId="tool-switcher-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span
              className={cn(
                "relative z-10 transition-colors",
                active
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label.toUpperCase()}
            </span>
          </button>
        );
      })}
    </div>
  );
}
