"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Status = "pending" | "processing" | "approved" | "flagged" | "rejected";

interface ModVideo {
    _id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    createdAt: string;
    moderation?: {
        status: Status;
        reason?: string;
        maxScore?: number;
        dominantClass?: string;
        faceCount?: number;
        genderStats?: { male: number; female: number; unknown: number };
        worst?: Record<string, number>;
    };
}

const TABS: { value: Status; label: string }[] = [
    { value: "flagged", label: "Flagged" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
];

export default function AdminModerationPage() {
    const { status } = useSession();
    const router = useRouter();
    const [tab, setTab] = useState<Status>("flagged");
    const [loading, setLoading] = useState(true);
    const [forbidden, setForbidden] = useState(false);
    const [items, setItems] = useState<ModVideo[]>([]);
    const [busyId, setBusyId] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    const load = useCallback(async (current: Status) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/moderation?status=${current}`);
            if (res.status === 403) {
                setForbidden(true);
                setItems([]);
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (status === "authenticated") load(tab);
    }, [status, tab, load]);

    async function act(id: string, newStatus: Status) {
        setBusyId(id);
        try {
            const res = await fetch(`/api/admin/moderation/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setItems((prev) => prev.filter((v) => v._id !== id));
            }
        } finally {
            setBusyId(null);
        }
    }

    if (forbidden) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-semibold mb-2">Admins only</h1>
                <p className="text-sm text-muted-foreground">
                    Your account doesn&apos;t have moderator access. Ask an admin to
                    set <code>isAdmin: true</code> on your user.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-semibold">Moderation queue</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        ReelsPro-powered content review — {items.length} item
                        {items.length === 1 ? "" : "s"}
                    </p>
                </div>
                <div className="flex gap-1 bg-muted/40 p-1 rounded-lg">
                    {TABS.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => setTab(t.value)}
                            className={`px-3 py-1.5 text-sm rounded-md transition ${
                                tab === t.value
                                    ? "bg-background shadow-sm font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-sm text-muted-foreground">
                    Loading…
                </div>
            ) : items.length === 0 ? (
                <div className="py-20 text-center text-sm text-muted-foreground">
                    No items in this queue.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((v) => {
                        const m = v.moderation;
                        return (
                            <div
                                key={v._id}
                                className="border rounded-xl overflow-hidden bg-card"
                            >
                                {v.thumbnailUrl && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={v.thumbnailUrl}
                                        alt={v.title}
                                        className="w-full aspect-video object-cover blur-sm hover:blur-none transition"
                                    />
                                )}
                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-medium truncate">{v.title}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {v.description}
                                        </p>
                                    </div>
                                    {m && (
                                        <div className="text-xs space-y-1 bg-muted/30 rounded p-2">
                                            <div>
                                                <span className="text-muted-foreground">Status: </span>
                                                <span className="font-medium">{m.status}</span>
                                            </div>
                                            {m.dominantClass && (
                                                <div>
                                                    <span className="text-muted-foreground">Top class: </span>
                                                    <span className="font-medium">{m.dominantClass}</span>
                                                    {typeof m.maxScore === "number" && (
                                                        <span className="ml-1 text-muted-foreground">
                                                            ({(m.maxScore * 100).toFixed(1)}%)
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {typeof m.faceCount === "number" && (
                                                <div>
                                                    <span className="text-muted-foreground">Faces: </span>
                                                    <span className="font-medium">{m.faceCount}</span>
                                                    {m.genderStats && (
                                                        <span className="ml-1 text-muted-foreground">
                                                            (M:{m.genderStats.male} F:{m.genderStats.female})
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {m.reason && (
                                                <div className="text-amber-600">{m.reason}</div>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            disabled={busyId === v._id}
                                            onClick={() => act(v._id, "approved")}
                                            className="flex-1 px-3 py-1.5 text-sm rounded bg-green-600/90 hover:bg-green-600 text-white disabled:opacity-50"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            disabled={busyId === v._id}
                                            onClick={() => act(v._id, "rejected")}
                                            className="flex-1 px-3 py-1.5 text-sm rounded bg-red-600/90 hover:bg-red-600 text-white disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
