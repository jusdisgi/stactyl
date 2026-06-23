# stactyl keywell — parameter set

Generator: **Cosmos** (`https://ryanis.cool/cosmos`). These were a **starting point** to dial in
against the physical TBK Mini, *not* a precise clone of it — Hunter likes the TBK feel but exact
matching is **not** a hard requirement (confirmed 2026-06-18), so PG1316S ergonomics win where they
conflict.

> **STATUS — geometry LOCKED 2026-06-18.** The model has been built and renders cleanly in Cosmos.
> The authoritative geometry now lives in **`stactyl-cosmos-expert.ts`** (Expert-mode per-key
> transforms); this file is the human-readable rationale. Final values that differ from the
> starting targets below: **finger spacing 18×17 mm** (standard Choc, not 17×17), **tenting 18°**,
> outboard pinky **1u** (custom rounded/tri caps later in CAD), and **microcontroller/connectors
> disabled** in Cosmos (controller + LiPo go in custom under-keywell pockets per the brief).
> **STEP/STL export DONE 2026-06-19** (`stactylleft/right.step` + case/plate STLs in this dir). Still
> to do: translating the transforms into the ergogen flat plate.

## Geometry target — Dactyl Manuform Mini lineage

The TBK Mini is a BastardKB **Dactyl Manuform Mini**. Its repo ships baked STLs/KiCad, **not a
parametric config**, so "match TBK Mini" = start from the well-known Dactyl-Manuform(-Mini)
defaults and tune. Classic DM defaults (tshort / carbonfet lineage), expressed in the terms
Cosmos uses:

| Concept (DM term)              | DM default      | In Cosmos                          | stactyl start |
|--------------------------------|-----------------|------------------------------------|---------------|
| Column curvature (`alpha`)     | π/12 = **15°**  | Column curvature (per-row angle)   | **15°**       |
| Row curvature (`beta`)         | π/36 = **5°**   | Row curvature (per-column angle)   | **5°**        |
| Tenting (`tenting-angle`)      | ~π/12 = 15°     | Tenting                            | **18°** *     |
| Center column (`centercol`)    | 3 (ring)        | Column the well pivots around      | **ring (3)**  |
| Center row (`centerrow`)       | nrows − 3       | —                                  | middle row    |

\* TBK Mini ships with optional **30°** detachable tents on top of its built-in tilt; 18° in the
well + hand/desk tilt is a sane low-profile starting tent. Dial 15–25°.

### Per-column Z / stagger (the part that makes it feel like a Dactyl)

Cosmos exposes per-column **stagger** and **height** offsets. Seed with the canonical DM column
profile (relative to the home/ring column), then tune to taste:

| Column        | Finger  | Rel. stagger (Y, mm) | Rel. height (Z, mm) |
|---------------|---------|----------------------|---------------------|
| 0 (outer)     | pinky   | -12 *(see note)*     | +2 *(slightly high)*|
| 1             | pinky   | 0                    | 0                   |
| 2             | ring    | +5                   | -1                  |
| 3 (center)    | middle  | +6  *(longest)*      | -2  *(deepest)*     |
| 4             | index   | +3                   | -1                  |

> stactyl drops the TBK's **outer 6th column** and keeps the inner 5. Column 0 above is the
> *kept* outer pinky column. The **+1 outboard pinky** key is a separate extra key anchored off
> the pinky home column (xiphos / TOTEM style), not a 6th finger column — place it in Cosmos as a
> single added key, angled outward, **not** by adding a column.

## Switch & spacing — PG1316S

| Param                    | Value          | Source / note                                              |
|--------------------------|----------------|------------------------------------------------------------|
| Switch model in Cosmos   | **Choc V1**    | Closest low-profile Z-height/socket proxy; Cosmos has no PG1316S |
| Keycap                   | Choc / stock   | Stock PG1316S caps are ~16×16; Cosmos Choc cap is close     |
| X spacing (columns)      | **17 mm**      | Hunter's `presets.pg1316s`: `ks: 17` (mikefive-style 17×17) |
| Y spacing (rows)         | **17 mm**      | `kp: 17`                                                    |
| Switch body              | 13 × 16 mm     | Kailh PG1316S datasheet                                     |

**Important:** in stactyl the switches are retained by the **printed keywell plate**, not the
PCB. So Cosmos's switch choice only matters for the **scoop Z-height and socket pockets** — the
real PG1316S pockets get modeled as a custom step on the plate. Use Cosmos for the scoop surface,
the per-key planes, and the shell; don't rely on its socket for retention.

## What we actually need *out* of Cosmos

1. **STEP of the keywell solid** → stow CAD (nest hulls, add magnet pads + registration) and the
   printed case. Cosmos STEP imports cleanly into Fusion/OnShape.
2. **Per-key transforms** (position + orientation of every key plane) from **Expert mode** → inform
   the ergogen **per-column comb** staggers (the flat plate is a BastardKB-style comb, not a developed
   grid; the serpentine necks absorb the curvature when bent, so no exact arc-length unfold). This is
   the bridge between the 3D well and the 2D plate.

## Thumb cluster (2 keys) — TODO

DM Mini ships 3 thumbs; stactyl drops to 2. Cosmos has a dedicated thumb-cluster editor — start
from its 2-key "tucked" preset, angle ~ -15° to -25°, positioned under the index/middle home
keys. Exact position/angle still open.

## Open geometry items

- [x] Build the Cosmos model + capture Expert per-key transforms (`stactyl-cosmos-expert.ts`).
      2026-06-18. STEP/STL exported 2026-06-19 (see below).
- [x] Finalize 2-key thumb position/angle and the outboard pinky key. 2026-06-18 (pinky 1u).
- [x] Spacing decided: **18×17** (standard Choc), revisit only if a printed test well says otherwise.
- [x] **Export STEP + STL** from Cosmos into this folder. 2026-06-19 — `stactylleft/right.step` +
      case/plate STLs. Geometry of record for the case + stow CAD; no longer depends on the live URL.
- [ ] Validate scoop depth is shallow enough for each column strip to flex onto its keys + the
      inter-column necks to reach, within FR-4 bend tolerance (the flex-by-thinness premise depends
      on a shallow well).
- [ ] **MCU / LiPo / USB pockets (custom CAD).** Cosmos's auto holder + connector are disabled, so
      on the exported STEP model: a **regular XIAO nRF52840 BLE** pocket (smaller than a nice!nano — easier
      on the tight shell + stow volume), a LiPo pocket, and a USB-C cutout aligned to the **XIAO's**
      onboard port (no separate connector). Decoupled from the generator on purpose.
      *(Controller: nice!nano → regular XIAO nRF52840 BLE, finalized 2026-06-23; see `../CLAUDE.md`.)*
