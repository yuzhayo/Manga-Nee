<!--
  TEMPLATE — house style for multi-phase execution plans in this repo.
  Purpose: an authoring agent can read THIS skeleton to learn the style, instead of
  reading a full concrete plan (e.g. PHASE_8_MERGED_PLAN.md) end-to-end.

  How to use:
  - Copy this file to `<NAME>_PLAN.md` and fill every {{PLACEHOLDER}}.
  - Delete guidance comments (<!-- ... -->) and any OPTIONAL block you don't need.
  - Keep the section ORDER and the emoji/heading markers — they're load-bearing cues
    the executor agent scans for (⚠️, ➡️ Handoff, 🔄 CONTEXT RESET).
  - Golden rules for the content you write:
      • Every phase lists exact Files, ends with Success Criteria + a Handoff.
      • `npm run typecheck` (or the repo's gate) closes every phase.
      • Anchor claims to real code (file:line, symbol names) — verify before writing.
      • Once a phase edits a file, later phases must NOT trust old line numbers.
-->

# {{Plan Title}} — Execution Plan ({{one-line scope}})

**Status:** 🚧 Ready to execute. This is the single source of truth for {{this work}}.
<!-- OPTIONAL: note what this supersedes, e.g. "Supersedes FOO_PLAN.md and BAR_PLAN.md." -->
**Executor:** A low-context coding agent. Read the Global Rules once, then execute the
phases in order. {{Note if order is mandatory and why, or if phases/tracks are independent.}}

---

## Overview
<!-- 3–6 sentences OR a bulleted track list. State what changes and the through-line.
     If phases group into independent "tracks", name them and their file boundaries so the
     reader knows what can reorder and what can't. -->

{{Short prose or:}}
- **Track A — {{name}} (Phases {{N–M}}):** {{what + which files + any ordering dependency}}.
- **Track B — {{name}} (Phases {{N–M}}):** {{what + why it runs after/before another track}}.

**Key architectural shifts:**
- **Before:** {{current state}}
- **After:** {{target state}}
- **State/approach philosophy:** {{e.g. plain useState co-located; no new store/Context/dep}}

---

## ⚠️ Reality Check (read once)
<!-- The most important section for correctness. Ground the plan in what the code ACTUALLY
     is right now: what's LIVE, what's DEAD, known defects that are in-scope to fix, and any
     decisions already made so the executor doesn't re-derive them. Cite file:line. -->

**What is LIVE (in use):** {{files + roles}}
**What is DEAD / half-finished (verify with the search command before trusting):** {{files + verdict: reuse or delete}}
**Known defects to fix along the way (in scope, not creep):** {{numbered list}}
**Decisions already made (follow, don't re-litigate):** {{numbered list}}

<!-- OPTIONAL block — include only when this plan overrides/absorbs another plan. -->
## ⚠️ Superseded / dropped: {{OtherPlan}} {{phase}}
{{Why the two conflict (same lines, contradictory semantics that typecheck can't catch),
which one wins, and an explicit "Do NOT implement {{OtherPlan}}" instruction.}}

---

## Global Rules (apply to EVERY phase)

**Execution protocol (context discipline — the executor has limited memory):**
1. Work strictly **one phase at a time, in order**. Never read ahead to a future phase.
2. Before starting a phase, discard everything from earlier phases except its "➡️ Handoff" line.
3. Open and re-read only the files the current phase names — **fresh from disk**, since line
   numbers shift as files are edited by earlier phases.
4. Finish the phase, verify its Success Criteria, write the Handoff, then STOP.

**Do NOT stray:**
- Touch ONLY the files listed under the current phase's "Files" section.
- If the actual code contradicts this plan (a file/prop/signature/line has moved or diverged),
  **STOP and report the discrepancy.** Do not improvise a workaround.
- No new dependencies. No features beyond what the phase lists. No `TODO`/placeholder code.
- {{Any repo-specific hard "do not touch" zones, e.g. already-fixed logic to leave alone.}}

**Correctness gate (there is no test suite, no linter):**
- Run `{{npm run typecheck}}` at the end of every phase. It MUST pass with zero errors.
  {{State the exact command from package.json and tell the executor to re-verify it hasn't changed.}}
- Do not delete a file until a search proves nothing imports it.

**⚠️ Shell environment — {{Windows PowerShell 5.x}}, NOT bash:**
`grep` does not exist and `&&` is a syntax error. Translate every command:
- Run each command on its own line (no `&&` chaining).
- Replace `grep -rn "pattern" src` with:
  ```powershell
  Get-ChildItem -Recurse src -Include *.ts,*.tsx | Select-String -Pattern "pattern"
  ```
- `{{npm run typecheck}}` works unchanged.

**Code quality — write like the surrounding code:**
- {{Match comment style (e.g. `// ─── Title ───`), typing rules (no `any`), naming.}}
- {{Styling convention: which files use what (Ant Design tokens + inline style vs Tailwind tokens).}}
- Prefer minimal diffs — targeted additions, not rewrites.

**Definition of Done (whole plan):** {{all phases' criteria met, gate clean, + the observable end-state.}}

---

# {{Track / group heading, if used}}

# Phase {{N}} — {{short imperative title}}

**Objective:** {{1–2 sentences: what this phase makes true. Outcome, not steps.}}

**Context you need ({{nothing from other phases / from Phase N-1's handoff}}):**
- {{Exact anchors: `file:line`, symbol names, current structure. Flag if line numbers are
  trustworthy (file untouched so far) or estimates (an earlier phase edited it → re-locate by content).}}

**Files:**
<!-- Every file with its verb. Use EDIT / CREATE / DELETE. DELETE lines state the guard. -->
- EDIT `{{path}}` — {{what changes}}.
- CREATE `{{path}}` — {{what it is}}.
- DELETE `{{path}}` — only after a search shows zero importers.

**Steps:**
1. {{Ordered, concrete actions. Inline small code snippets where exact shape matters.}}
2. {{...}}
3. `{{npm run typecheck}}`.
<!-- OPTIONAL: manual verification steps for behavior a typecheck can't catch. -->

**Success Criteria:**
- [ ] {{Checkable, specific outcomes — one per behavior/guarantee.}}
- [ ] `{{npm run typecheck}}` passes with zero errors.

**➡️ Handoff:** "{{2–4 sentences the NEXT phase inherits: what's now true, what's deliberately
NOT done yet, and any warning (e.g. 'files X/Y were edited this phase — re-read fresh, don't
trust line numbers below'). This is the ONLY thing carried past the context reset.}}"

---
## 🔄 CONTEXT RESET — discard Phase {{N}} detail. Keep only its Handoff. Re-read the plan file from Phase {{N+1}}.
---

<!-- Repeat the Phase block + CONTEXT RESET separator for each phase.
     Mark clearly OPTIONAL phases: "Optional — ship only if Phases X–Y are clean." -->

# Phase {{last}} — {{Cleanup, docs, and final verification — typical closer}}

**Objective:** {{Remove remaining dead code, update docs to match, prove it type-checks. No behavior change.}}
<!-- Standard closer: grep for dangling imports, delete confirmed-dead files, update CLAUDE.md
     and any memory/architecture doc, final gate run. -->

**➡️ Handoff (final):** "{{Plan complete. One-paragraph statement of the delivered end-state.}}"

---

## Appendix — File change ledger (quick reference)
<!-- One row per (file, phase) so a reader sees the whole footprint without reading phases. -->

| File | Phase(s) | Action |
|------|----------|--------|
| `{{path}}` | {{N}} | {{edit / **create** / **delete**}} — {{what}} |

**Reused as-is (do not recreate):** {{files the plan depends on but never edits}}

## Appendix — Rejected / deferred (not scoped)
<!-- Records what was considered and consciously left out, so it isn't re-proposed later. -->
- **{{Idea}}** — {{one-line reason it's out of scope / deferred.}}
