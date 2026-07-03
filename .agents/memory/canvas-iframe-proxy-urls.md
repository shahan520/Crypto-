---
name: Canvas iframe URLs must use the path proxy, not a raw port
description: Why embedding domain:<port> for canvas iframes broke in this project, and what URL form actually works.
---

This project (and any project using Replit's path-based artifact routing) exposes each artifact's dev server through a path prefix on the shared domain (e.g. `/__mockup`), not through its raw local port. The `.replit` file may still list a direct port mapping (e.g. `localPort 8081 -> externalPort 8081`), but that external port can be unreachable or time out for the user even though `curl localhost:<port>` succeeds inside the container.

**Why:** A canvas iframe was created with `https://<domain>:8081/__mockup/...` — it worked from the sandbox shell (`curl localhost:8081` returned 200) but failed for the user in the browser with repeated errors, because the port-based external route wasn't actually reachable the way the path-based proxy route is.

**How to apply:** When embedding an artifact's dev server as a canvas iframe (or any external-facing link), prefer the no-port, path-prefixed URL through the shared proxy: `https://<REPLIT_DOMAINS>/<previewPath>/...` (get `previewPath` from the artifact's `.replit-artifact/artifact.toml`). Only fall back to `domain:<port>` if you've verified with `curl -I https://<domain>:<port>/...` from the shell that it actually returns 200 externally — don't trust a `localhost` curl alone.
