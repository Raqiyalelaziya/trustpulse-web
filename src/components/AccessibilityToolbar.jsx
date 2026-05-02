import { useState, useEffect } from 'react';
import { Eye, Type, ZoomIn, ZoomOut, RotateCcw, Accessibility, X } from 'lucide-react';

export default function AccessibilityToolbar() {
  const [open, setOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.body.style.fontSize = fontSize === 100 ? '' : `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    document.body.classList.toggle('focus-visible-strong', focusMode);
  }, [focusMode]);

  function reset() {
    setHighContrast(false);
    setLargeText(false);
    setFocusMode(false);
    setFontSize(100);
    document.documentElement.classList.remove('high-contrast');
    document.body.style.fontSize = '';
    document.body.classList.remove('focus-visible-strong');
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col items-end gap-2">
      {/* Panel */}
      {open && (
        <div
          className="bg-card border border-border shadow-2xl rounded-2xl p-4 w-72 space-y-4"
          role="dialog"
          aria-label="Accessibility Options"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-primary" />
              <span className="font-heading font-bold text-sm">Accessibility</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close accessibility panel" className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Text Size</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize((s) => Math.max(80, s - 10))}
                aria-label="Decrease text size"
                className="flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-secondary hover:bg-muted transition-colors"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <div className="flex-1 text-center text-sm font-semibold">{fontSize}%</div>
              <button
                onClick={() => setFontSize((s) => Math.min(150, s + 10))}
                aria-label="Increase text size"
                className="flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-secondary hover:bg-muted transition-colors"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Visual Options</p>
            <div className="space-y-2">
              <ToggleRow
                label="High Contrast"
                description="Stronger color contrast"
                icon={Eye}
                active={highContrast}
                onToggle={() => setHighContrast((v) => !v)}
              />
              <ToggleRow
                label="Focus Highlights"
                description="Bold outlines on focused elements"
                icon={Type}
                active={focusMode}
                onToggle={() => setFocusMode((v) => !v)}
              />
            </div>
          </div>

          {/* Sign Language note */}
          <div className="bg-primary/8 border border-primary/20 rounded-xl p-3 space-y-1">
            <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
              🤟 Visual-First Design
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All icons include text labels. Images have descriptions. Forms show clear visual errors. No audio-only content.
            </p>
          </div>

          {/* Reset */}
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground py-2 rounded-xl border border-border hover:bg-secondary transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to defaults
          </button>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open accessibility options"
        title="Accessibility Options"
        className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105"
      >
        <Accessibility className="h-6 w-6" />
      </button>
    </div>
  );
}

function ToggleRow({ label, description, icon: Icon, active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
        active
          ? 'bg-primary/10 border-primary/30 text-primary'
          : 'bg-secondary/50 border-border/50 text-foreground hover:bg-secondary'
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className={`h-5 w-9 rounded-full transition-colors flex items-center px-0.5 ${active ? 'bg-primary' : 'bg-border'}`}>
        <div className={`h-4 w-4 rounded-full bg-white transition-transform shadow-sm ${active ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </button>
  );
}