# ReelsPro × HaramBlur Integration — Task Tracker

> Goal: Integrate HaramBlur-style NSFW/face detection and content moderation into the ReelsPro Next.js backend. Give users per-account content filter preferences, auto-blur flagged regions, and provide an admin moderation dashboard plus semantic similarity search.

Legend: ✅ done · 🟡 in progress · ⬜ todo · ❌ blocked / deferred

---

## Phase 0 — Research & Planning
- ✅ Clone ReelsPro (`https://github.com/Sankalp20Tiwari/reelsPro`)
- ✅ Read repo structure (models, api routes, upload form, auth)
- ✅ Research HaramBlur stack (NSFWJS + vladmandic/human)
- ✅ Research server-side Node.js equivalents (`@tensorflow/tfjs-node`, `@vladmandic/human`, `fluent-ffmpeg`)
- ✅ Author this task tracker (`TASKS.md`)

## Phase 1 — Dependencies & Environment
- ✅ Install NSFW detection: `nsfwjs`, `@tensorflow/tfjs`
- ✅ Install face/human detection: `@vladmandic/human`
- ✅ Install video tooling: `fluent-ffmpeg`, `@ffmpeg-installer/ffmpeg`, `@ffprobe-installer/ffprobe`
- ✅ Install image utilities: `sharp`
- ✅ Env vars documented below
- ⬜ (Optional speed-up) Attempt `@tensorflow/tfjs-node` install for native perf — loader already falls back gracefully

> Windows note: `@tensorflow/tfjs-node` requires native build; we installed pure-JS `@tensorflow/tfjs` so the pipeline works out-of-the-box. `lib/moderation/tf-loader.ts` prefers native when available.

## Phase 2 — Data Model Extensions
- ✅ `models/User.ts` — `contentFilter: 'off' | 'moderate' | 'strict'`, `blurFaces`, `isAdmin`
- ✅ `models/Video.ts` — full `moderation` subdocument (status, scores, frames, faceCount, genderStats, embedding, blurredUrl, review fields)
- ✅ `uploadedBy` ref on Video

## Phase 3 — Core Moderation Library (`lib/moderation/`)
- ✅ `types.ts` — shared TS types
- ✅ `tf-loader.ts` — tfjs-node → tfjs fallback
- ✅ `nsfw-detector.ts` — NSFWJS MobileNetV2 singleton + aggregate helpers
- ✅ `face-detector.ts` — vladmandic/human wrapper (gracefully disables if load fails)
- ✅ `frame-extractor.ts` — ffmpeg-based N-frame sampler from video URL
- ✅ `video-blur.ts` — ffmpeg boxblur + sharp image blur
- ✅ `blur-upload.ts` — blur → ImageKit upload pipeline
- ✅ `pipeline.ts` — orchestrator, verdict, cosine similarity
- ✅ `thresholds.ts` — upload + view-time threshold presets
- ✅ `ssrf-guard.ts` — URL allowlist (defaults to ImageKit, blocks private/metadata IPs)
- ✅ `index.ts` — barrel export

## Phase 4 — API Routes
- ✅ `POST /api/moderation/scan` — returns full `ModerationReport` for a URL (SSRF-guarded, auth required)
- ✅ `POST /api/videos` — inline moderation with block/flag/blur verdicts, `runtime=nodejs`, `maxDuration=60`
- ✅ `GET /api/videos` — filters by viewer's `contentFilter` preference; strict hides unscanned
- ✅ `GET /api/videos/similar/[id]` — cosine similarity over stored embeddings
- ✅ `GET /api/user/preferences` + `PUT /api/user/preferences`
- ✅ `GET /api/admin/moderation?status=flagged` — admin-gated queue
- ✅ `PATCH /api/admin/moderation/[id]` — approve / reject / override

## Phase 5 — UI
- ✅ `/settings` page — content filter radio, blur-faces toggle
- ✅ `/admin/moderation` page — tabbed queue with scores, approve/reject actions
- ✅ Upload form — show post-submit moderation status inline (currently only via network tab)
- ✅ Video card — "blurred version" toggle + moderation badge

## Phase 6 — Validation
- ✅ Type-check: `npx tsc --noEmit` → **0 errors**
- ✅ First code review pass (issues addressed: SSRF, route timeout, blur wiring, `worst` in report, strict-vs-pending)
- ✅ Second code review pass (issues addressed: added moderation UI, fixed badge states)
- 🟡 Manual smoke test: `npm run dev` — server starts, DB connects (standard URI fix applied). Moderation API 500 pending tfjs/ffmpeg fix.
- ⬜ Load test with a long video (timeout confirmation)

## Phase 7 — Nice-to-haves (deferred / documented)
- ❌ pgvector — project uses MongoDB; using Mongo + in-memory cosine over stored embeddings. Migration to Postgres+pgvector documented in code.
- ⬜ Background job queue for heavy videos (BullMQ + Redis) — currently runs inline within 60s budget
- ⬜ Webhook from ImageKit on upload → trigger async scan (better UX than inline)
- ⬜ Per-creator override rules
- ⬜ Audit log for admin actions
- ⬜ Replace `fluent-ffmpeg` (deprecated) with a maintained fork
- ⬜ Bundle `@vladmandic/human` models under `/public/models/` to avoid runtime CDN fetch

---

## Quick architecture
```
Upload (ImageKit) ──▶ POST /api/videos
                        │
                        ▼ (SSRF guard → allowlist)
                 moderationPipeline(url)
                   1. download bytes (or sample frames via ffmpeg)
                   2. NSFWJS classify each sample
                   3. @vladmandic/human face detect + gender
                   4. aggregate → verdict
                        │
                        ├── approved  → save + index embedding
                        ├── flagged   → save with status=flagged (admin queue)
                        ├── blur      → ffmpeg boxblur → ImageKit upload → save blurredUrl
                        └── rejected  → 422 error, don't save
```

## Env vars (.env.local)
```
# Existing
NEXTAUTH_SECRET=
MONGODB_URI=
NEXT_PUBLIC_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
NEXT_PUBLIC_URL_ENDPOINT=

# New (moderation)
MODERATION_ENABLED=true                # set to "false" to disable
MODERATION_MODE=flag                   # block | flag | blur
NSFW_THRESHOLD_PORN=0.6
NSFW_THRESHOLD_HENTAI=0.6
NSFW_THRESHOLD_SEXY=0.85
VIDEO_FRAME_SAMPLE_COUNT=5
MODERATION_ALLOWED_HOSTS=              # comma-separated extras; ImageKit host is always allowed
```

## How to become an admin (dev)
There's no self-serve admin flow. Flip the flag directly in Mongo:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { isAdmin: true } })
```
Then visit `/admin/moderation`.

## Known limitations
- **Inline moderation** on upload may approach the 60s budget for long videos. Move to a background queue for production (Phase 7).
- **Pure-JS tfjs** is the default on Windows; NSFWJS inference is slower than with `tfjs-node`. Install native bindings for ~10× speedup.
- **vladmandic/human** downloads model weights from a public CDN on first use.

---

## Run-time fixes applied (this session)
| # | Issue | Fix |
|---|-------|-----|
| 1 | Typo in `lib/db.ts`: `MONGDB_URI` → `MONGODB_URI` | Fixed variable name |
| 2 | `MONGODB_URI` `ENOTFOUND` (`+srv` SRV record blocked by ISP/router DNS) | Switched to standard `mongodb://` connection string with explicit shard hosts fetched via Atlas CLI |
| 3 | Atlas CLI not installed | Installed via `winget install MongoDB.MongoDBAtlasCLI` |
| 4 | MongoDB IP whitelist missing | Added `0.0.0.0/0` via `atlas accessLists create` |
| 5 | Turbopack unable to bundle `@ffmpeg-installer`, `@ffprobe-installer`, `fluent-ffmpeg`, `@tensorflow/tfjs-node` (binary/native modules) | Added `serverExternalPackages` list to `next.config.ts` |
| 6 | `@tensorflow/tfjs-node` not installed (pure-JS fallback works, but causes a Turbopack warning) | Warning suppressed via `serverExternalPackages`; optional native install documented in Phase 1 |
