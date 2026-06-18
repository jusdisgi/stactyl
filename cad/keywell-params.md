# stactyl keywell — starting parameter set

Generator: **Cosmos** (`https://ryanis.cool/cosmos`). Captured 2026-06-18. These are a **starting
point** to dial in against the physical TBK Mini, *not* a precise clone of it — Hunter likes the
TBK feel but exact matching is **not** a hard requirement (confirmed 2026-06-18), so PG1316S
ergonomics win where they conflict.

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
2. **Per-key transforms** (position + orientation of every key plane) from **Expert mode** → feed
   the ergogen flat-plate developed/arc-length facet spacing so the flexed board lands on the
   posts. This is the bridge between the 3D well and the 2D plate.

## Thumb cluster (2 keys) — TODO

DM Mini ships 3 thumbs; stactyl drops to 2. Cosmos has a dedicated thumb-cluster editor — start
from its 2-key "tucked" preset, angle ~ -15° to -25°, positioned under the index/middle home
keys. Exact position/angle still open.

## Open geometry items

- [ ] Build the Cosmos model with the above; export STEP + capture Expert per-key transforms.
- [ ] Validate scoop depth is shallow enough for the thin-FR-4 necks to reach each facet within
      FR-4 bend tolerance (the whole flex-by-thinness premise depends on a shallow well).
- [ ] Finalize 2-key thumb position/angle and the outboard pinky key.
- [ ] Confirm 17×17 vs slightly wider (18) once a printed test well is in hand.
