"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type FilterLevel = "off" | "moderate" | "strict";

export default function SettingsPage() {
    const { status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [contentFilter, setContentFilter] = useState<FilterLevel>("moderate");
    const [blurFaces, setBlurFaces] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    useEffect(() => {
        if (status !== "authenticated") return;
        (async () => {
            try {
                const res = await fetch("/api/user/preferences");
                if (res.ok) {
                    const data = await res.json();
                    setContentFilter(data.contentFilter ?? "moderate");
                    setBlurFaces(!!data.blurFaces);
                    setEmail(data.email ?? null);
                    setIsAdmin(!!data.isAdmin);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [status]);

    async function save() {
        setSaving(true);
        try {
            const res = await fetch("/api/user/preferences", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contentFilter, blurFaces }),
            });
            if (res.ok) {
                setToast("Saved ✓");
                setTimeout(() => setToast(null), 2000);
            } else {
                setToast("Failed to save");
            }
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading settings…</div>
            </div>
        );
    }

    const options: { value: FilterLevel; title: string; desc: string }[] = [
        {
            value: "off",
            title: "Off",
            desc: "Show all content. No moderation filter applied to your feed.",
        },
        {
            value: "moderate",
            title: "Moderate (recommended)",
            desc: "Hide content with high confidence of NSFW classifications.",
        },
        {
            value: "strict",
            title: "Strict",
            desc: "Hide anything even mildly suggestive. ReelsPro-style strict filtering.",
        },
    ];

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-semibold mb-2">Settings</h1>
            {email && (
                <p className="text-sm text-muted-foreground mb-8">
                    Signed in as <span className="font-medium">{email}</span>
                    {isAdmin && (
                        <span className="ml-2 inline-block text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-600">
                            admin
                        </span>
                    )}
                </p>
            )}

            <section className="mb-10">
                <h2 className="text-xl font-medium mb-3">Content filter</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Controls which reels are shown in your feed based on automated
                    NSFW detection.
                </p>
                <div className="space-y-3">
                    {options.map((opt) => (
                        <label
                            key={opt.value}
                            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                contentFilter === opt.value
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-muted/30"
                            }`}
                        >
                            <input
                                type="radio"
                                name="contentFilter"
                                className="mt-1"
                                checked={contentFilter === opt.value}
                                onChange={() => setContentFilter(opt.value)}
                            />
                            <div>
                                <div className="font-medium">{opt.title}</div>
                                <div className="text-sm text-muted-foreground">
                                    {opt.desc}
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-xl font-medium mb-3">Face blurring</h2>
                <label className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer">
                    <input
                        type="checkbox"
                        className="mt-1"
                        checked={blurFaces}
                        onChange={(e) => setBlurFaces(e.target.checked)}
                    />
                    <div>
                        <div className="font-medium">Blur detected faces</div>
                        <div className="text-sm text-muted-foreground">
                            ReelsPro-style face blurring applied on top of NSFW
                            filtering.
                        </div>
                    </div>
                </label>
            </section>

            <div className="flex items-center gap-3">
                <button
                    onClick={save}
                    disabled={saving}
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-50"
                >
                    {saving ? "Saving…" : "Save preferences"}
                </button>
                {toast && (
                    <span className="text-sm text-green-600">{toast}</span>
                )}
                {isAdmin && (
                    <a
                        href="/admin/moderation"
                        className="ml-auto text-sm underline text-amber-600"
                    >
                        Open moderation dashboard →
                    </a>
                )}
            </div>
        </div>
    );
}
