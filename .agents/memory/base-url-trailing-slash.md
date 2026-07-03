---
name: BASE_URL missing trailing slash breaks concatenated asset paths
description: Why `${BASE}file.png`-style image paths silently 404'd in the crypto-wallet mockup, and the general fix.
---

`import.meta.env.BASE_URL` is not guaranteed to end with a trailing slash — it depends on how the `base` (or a `BASE_PATH` env var feeding it) was set in `vite.config.ts`. In this project the mockup-sandbox artifact sets `base: process.env.BASE_PATH` directly from an env var like `/__mockup` (no trailing slash), so `import.meta.env.BASE_URL` resolved to `/__mockup` instead of `/__mockup/`.

**Why:** Code that builds asset URLs via naive string concatenation (`` `${BASE}a1.png` ``) produced `/__mockupa1.png` — a path that doesn't match the artifact's registered route prefix, so it 404'd. The `<img onError>` handler hid the broken image without surfacing an error, so the UI silently fell back to a blank/colored placeholder box instead of showing the real photo. This looked like "the images were never uploaded" even though the files existed and were correctly referenced by name.

**How to apply:** Never concatenate `BASE` directly with a filename. Normalize it first (`BASE.endsWith("/") ? BASE : BASE + "/"`) or use a path-join helper, before building any asset URL from `import.meta.env.BASE_URL`. When an `<img>` (or similar asset) appears to silently fail to render with no visible error, check the actual network request path (via workflow/server request logs, not just a `curl` on the expected path) for a missing separator or malformed prefix before assuming the asset itself is missing.
