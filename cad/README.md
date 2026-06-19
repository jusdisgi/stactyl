# cad/ — stactyl keywell (Cosmos → STEP → CAD)

The 3D keywell does **not** come from ergogen (ergogen is 2D). It comes from the **Cosmos**
generator and is finished in CAD.

## Workflow

1. **Model in Cosmos** (`https://ryanis.cool/cosmos`) using `keywell-params.md` as the starting
   parameter set. Use **Advanced** for the sliders, then **Expert mode** (JS) to read out / lock
   the per-key transforms.
2. **Export STEP** (multi-part) — imports cleanly into Fusion / OnShape. Also export STL for quick
   test prints.
3. **Save artifacts here:** the Cosmos config (the JSON/URL state and/or the Expert-mode JS), the
   exported `.step`, and any `.stl`. Keep the config text-committed so the well is reproducible —
   don't rely on the exported mesh alone.
4. **Stow CAD** (later): bring both halves into one assembly in the *stowed pose*, nest the convex
   hulls (rotate past 180°), and cut **matched magnet pads + a registration feature** as negatives
   of each other. See `../CLAUDE.md` "Stow / mate concept".

## Files (to be added)

- `stactyl-cosmos-expert.ts` — **present.** Expert-mode config: the per-key transforms, and the
  reproducible source of the geometry (paste into Cosmos Expert mode to reload). This is the bridge
  to the flat plate.
- `keywell-params.md` — **present.** Human-readable rationale + locked-parameter record.
- `keywell.step`, `keywell.stl` — **pending.** Export from Cosmos → Download.

## Why Cosmos (vs Dactyl-Manuform / Dometyl)

Clean **STEP** export for the stow CAD + magnet-pad booleans; **Expert-mode per-key transforms**
to derive the flat-plate facet layout; native low-profile switch support; actively maintained web
tool, no OpenSCAD/opam toolchain to stand up. Decided 2026-06-18.
