---
name: Crypto wallet mockup structure
description: How App.tsx (crypto-wallet mockup) is organized — many top-level function components in one file, not nested.
---

`artifacts/mockup-sandbox/src/components/mockups/crypto-wallet/App.tsx` is a single large file with many **top-level** `function X(...)` component definitions in sequence (e.g. `TaskDetailScreen`, `Pill`, `StatusChip`, `OrderDetailsPopup`, `RecordScreen`, ...). They are not nested inside each other.

**Why this matters:** grepping for `^function \w+Screen` only finds screen-named components and skips helper components like `Pill`, `StatusChip`, `OrderDetailsPopup` that sit between two "Screen" components. Assuming the JSX between two `Screen` matches belongs to one component leads to inserting new JSX/state into the wrong function — this caused a real Babel parse error (mismatched closing tags) in this codebase.

**How to apply:** before editing near the end of a component's `return (...)`, verify the function's true closing brace via `grep -n '^function '` across the *whole* file (not just `\w+Screen` names), or by matching indentation back from a known line, rather than assuming the next differently-named function starts a new "screen" boundary. After large multi-part edits to this file, run `npx tsc --noEmit -p .` inside `artifacts/mockup-sandbox` to catch syntax/duplicate-prop errors before considering the task done.
