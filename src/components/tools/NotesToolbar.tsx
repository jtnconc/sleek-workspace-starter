import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bold,
  Italic,
  ImagePlus,
  Type,
  List,
  Highlighter,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  execNotesCommand,
  insertNotesImage,
  toggleNotesList,
  applyNotesHighlight,
} from "./notes-format";

const COLORS = [
  { label: "Ink", value: "#1c1c1e" },
  { label: "Blue", value: "#2563eb" },
  { label: "Green", value: "#0f766e" },
  { label: "Amber", value: "#b45309" },
  { label: "Red", value: "#b91c1c" },
  { label: "Violet", value: "#6d28d9" },
];

const HIGHLIGHTS = [
  { label: "Soft yellow", value: "#fef3c7" },
  { label: "Soft green", value: "#dcfce7" },
  { label: "Soft pink", value: "#fce7f3" },
  { label: "Soft blue", value: "#dbeafe" },
  { label: "Soft lavender", value: "#ede9fe" },
];

const btn =
  "flex size-8 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-desk transition-colors hover:bg-secondary hover:text-foreground";
const activeBtn =
  "bg-primary text-primary-foreground border-primary hover:bg-primary hover:text-primary-foreground";

/** Shared staggered scale+fade entrance used by every toolbar button. */
const entrance = (i: number) => ({
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring" as const, stiffness: 400, damping: 25, delay: i * 0.04 },
});

export function NotesToolbar() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    list: false,
  });

  const syncActive = () => {
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      list: document.queryCommandState("insertUnorderedList"),
    });
  };

  useEffect(() => {
    syncActive();
    document.addEventListener("selectionchange", syncActive);
    return () => document.removeEventListener("selectionchange", syncActive);
  }, []);

  const toggle = (command: "bold" | "italic") => {
    execNotesCommand(command);
    // Reflect the new state immediately so combined bold+italic both stay lit.
    syncActive();
  };

  const pickImage = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => insertNotesImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-1.5">
      <motion.button
        type="button"
        aria-label="Bold"
        aria-pressed={active.bold}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggle("bold")}
        className={cn(btn, active.bold && activeBtn)}
        {...entrance(0)}
      >
        <Bold className="size-[14px]" />
      </motion.button>
      <motion.button
        type="button"
        aria-label="Italic"
        aria-pressed={active.italic}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggle("italic")}
        className={cn(btn, active.italic && activeBtn)}
        {...entrance(1)}
      >
        <Italic className="size-[14px]" />
      </motion.button>

      <motion.button
        type="button"
        aria-label="Bullet list"
        aria-pressed={active.list}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          toggleNotesList();
          syncActive();
        }}
        className={cn(btn, active.list && activeBtn)}
        {...entrance(2)}
      >
        <List className="size-[14px]" />
      </motion.button>

      <Popover>
        <PopoverTrigger asChild>
          <motion.button
            type="button"
            aria-label="Highlight text"
            onMouseDown={(e) => e.preventDefault()}
            className={btn}
            {...entrance(3)}
          >
            <Highlighter className="size-[14px]" />
          </motion.button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-2">
          <div className="flex items-center gap-1.5">
            {HIGHLIGHTS.map((h) => (
              <button
                key={h.value}
                type="button"
                aria-label={h.label}
                title={h.label}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyNotesHighlight(h.value)}
                className="size-6 rounded-full border border-border transition-transform hover:scale-110"
                style={{ backgroundColor: h.value }}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <motion.button
            type="button"
            aria-label="Typography"
            onMouseDown={(e) => e.preventDefault()}
            className={btn}
            {...entrance(4)}
          >
            <Type className="size-[14px]" />
          </motion.button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 space-y-3 p-3">
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Text color
            </p>
            <div className="flex items-center gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  aria-label={c.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => execNotesCommand("foreColor", c.value)}
                  className="size-5 rounded-full border border-border transition-transform hover:scale-110"
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>

        </PopoverContent>
      </Popover>

      <motion.button
        type="button"
        aria-label="Insert image"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className={btn}
        {...entrance(5)}
      >
        <ImagePlus className="size-[14px]" />
      </motion.button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          pickImage(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
