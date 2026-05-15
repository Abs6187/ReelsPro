"use client";

import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  X,
  ChevronRight,
  Sliders,
  UserX,
  Loader2,
  Check,
} from "lucide-react";

type FilterLevel = "off" | "moderate" | "strict";

interface Prefs {
  contentFilter: FilterLevel;
  blurFaces: boolean;
}

const FILTER_CONFIG: {
  value: FilterLevel;
  label: string;
  desc: string;
  color: string;
  ring: string;
  bg: string;
}[] = [
  {
    value: "off",
    label: "Off",
    desc: "Show all content",
    color: "text-gray-300",
    ring: "ring-gray-500",
    bg: "bg-gray-500",
  },
  {
    value: "moderate",
    label: "Moderate",
    desc: "Hide explicit content",
    color: "text-blue-400",
    ring: "ring-blue-500",
    bg: "bg-blue-500",
  },
  {
    value: "strict",
    label: "Strict",
    desc: "Approved content only",
    color: "text-green-400",
    ring: "ring-green-500",
    bg: "bg-green-500",
  },
];

export default function ModerationFAB() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ contentFilter: "moderate", blurFaces: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  // Load preferences on mount
  useEffect(() => {
    fetch("/api/user/preferences")
      .then((r) => r.json())
      .then((data) => {
        if (data.contentFilter) {
          setPrefs({ contentFilter: data.contentFilter, blurFaces: !!data.blurFaces });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const save = async (newPrefs: Prefs) => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrefs),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      /* silent */
    } finally {
      setSaving(false);
    }
  };

  const setFilter = (f: FilterLevel) => {
    const next = { ...prefs, contentFilter: f };
    setPrefs(next);
    save(next);
  };

  const toggleBlurFaces = () => {
    const next = { ...prefs, blurFaces: !prefs.blurFaces };
    setPrefs(next);
    save(next);
  };

  const activeFilter = FILTER_CONFIG.find((c) => c.value === prefs.contentFilter)!;

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popup Panel */}
      {open && (
        <div className="w-72 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-reelspro-blue" />
              <span className="text-sm font-semibold text-white">Content Controls</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors rounded-full p-0.5 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content Filter */}
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Shield className="h-3 w-3" /> Strictness
            </p>
            <div className="flex flex-col gap-2">
              {FILTER_CONFIG.map((cfg) => (
                <button
                  key={cfg.value}
                  onClick={() => setFilter(cfg.value)}
                  disabled={saving}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl border transition-all duration-150 ${
                    prefs.contentFilter === cfg.value
                      ? `border-white/20 bg-white/10 ${cfg.ring} ring-1`
                      : "border-white/5 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        prefs.contentFilter === cfg.value ? cfg.bg : "bg-white/20"
                      }`}
                    />
                    <div className="text-left">
                      <p className={`text-sm font-medium ${prefs.contentFilter === cfg.value ? cfg.color : "text-gray-300"}`}>
                        {cfg.label}
                      </p>
                      <p className="text-xs text-gray-500">{cfg.desc}</p>
                    </div>
                  </div>
                  {prefs.contentFilter === cfg.value && (
                    <Check className={`h-4 w-4 ${cfg.color}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Blur Faces Toggle */}
          <div className="px-4 pt-2 pb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <UserX className="h-3 w-3" /> Face Detection
            </p>
            <button
              onClick={toggleBlurFaces}
              disabled={saving}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl border transition-all duration-150 ${
                prefs.blurFaces
                  ? "border-purple-500/40 bg-purple-500/10 ring-1 ring-purple-500"
                  : "border-white/5 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                {prefs.blurFaces ? (
                  <EyeOff className="h-4 w-4 text-purple-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
                <div className="text-left">
                  <p className={`text-sm font-medium ${prefs.blurFaces ? "text-purple-400" : "text-gray-300"}`}>
                    Blur Faces
                  </p>
                  <p className="text-xs text-gray-500">
                    {prefs.blurFaces ? "Faces auto-blurred" : "Faces shown normally"}
                  </p>
                </div>
              </div>
              {/* Toggle Switch */}
              <div
                className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
                  prefs.blurFaces ? "bg-purple-500" : "bg-white/20"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    prefs.blurFaces ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Save status */}
          {(saving || saved) && (
            <div className="px-4 py-2 border-t border-white/10 flex items-center gap-2">
              {saving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                  <span className="text-xs text-gray-400">Saving…</span>
                </>
              ) : (
                <>
                  <Check className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">Saved!</span>
                </>
              )}
            </div>
          )}

          {/* Quick link to full settings */}
          <a
            href="/settings"
            className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span>Advanced settings</span>
            <ChevronRight className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Content moderation controls"
        className={`relative h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group ${
          open
            ? "bg-reelspro-blue scale-110 rotate-12"
            : "bg-gradient-to-br from-reelspro-blue to-reelspro-purple hover:scale-110 hover:shadow-reelspro-blue/40"
        }`}
      >
        {loading ? (
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        ) : open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Shield className="h-6 w-6 text-white" />
        )}
        {/* Active filter indicator dot */}
        {!open && (
          <span
            className={`absolute top-1 right-1 h-3 w-3 rounded-full border-2 border-black ${activeFilter.bg}`}
          />
        )}
      </button>
    </div>
  );
}
