# stactyl

A **portable, stowable split ergonomic keyboard** — *"stacks + dactyl"*: a true 3D scooped
keywell that **clamshells into a minimum-volume stowed stack** for travel.

stactyl reuses the **3D column geometry of the BastardKB TBK Mini** (a Dactyl Manuform Mini) but
is a clean, fresh design built around:

- **36 keys** — 3×5 finger matrix + 1 outboard pinky + 2 thumbs, **per hand** (18/hand).
- **Kailh PG1316S** ultra-low-profile switches (consigned at Seeed Fusion, `C9900170245`).
- **XIAO nRF52840 Plus per half, matrix wiring + diodes** (the `tbkmini` recipe). Left half = split
  central. **Fully assembled (turnkey) at Seeed Fusion** — XIAO is Seeed's catalog part, so no DNP
  and no hand-soldering.
- **Per-key + underglow addressable RGB** — **SK6805-1515 (EC15)**, `C2890035` (machine-placed,
  top-side in the switch center cutout per LightFury; single-wire, runs off LiPo with no boost; the
  5 mA / 1.5×1.5 mm low-power variant, chosen for battery life + strip space).
- A **thin rigid FR-4 "flex-by-thinness" plate**, built as a **BastardKB-style per-column comb**:
  each finger column is one full-width strip, columns joined by single serpentine necks, terminating
  at a rigid controller root (XIAO Plus) that folds into the keywell pocket. PCBA'd flat, then bent
  into the printed keywell. Standard rigid PCBA pipeline — no rigid-flex, no polyimide, no grid.
- A **printed 3D keywell** (from the **Cosmos** generator → STEP) that retains the switches and
  carries the formed plate.
- A **stow concept** that mates the two keywells past 180° to nest their convex hulls, held by
  matched magnet pads + a registration feature. Expect a chunky lens, not a pocketable clamshell.

## Toolchain note — two pipelines

Unlike every other board in `gittyup`, stactyl is **not** a pure-ergogen project, because ergogen
is 2D and cannot model a keywell.

- **Keywell / 3D shell:** generated in **Cosmos** (`ryanis.cool/cosmos`), exported as STEP,
  finished in CAD (Fusion/OnShape). See `cad/`.
- **Flat-plate PCB:** ergogen lays out the **per-column comb** (`config.yaml`) — staggered-column
  strips joined by serpentine necks, plus the rigid controller root. The Cosmos per-key transforms
  inform the column staggers; the necks absorb the curvature when bent, so no arc-length unfold is
  needed. Routed in KiCad. PCBA + KiKit panelization as usual.

## Layout

```
Per hand:  3 rows × 5 columns finger well   = 15
           + 1 outboard pinky (off home col) =  1
           + 2 thumb keys                     =  2
                                              ----
                                               18   ×2 hands = 36
```

## Repo contents

- `CLAUDE.md` — design brief / notes for future sessions (start here).
- `cad/` — Cosmos keywell config, the captured geometry parameter set (`keywell-params.md`),
  and exported STEP/STL.
- `config.yaml` — ergogen per-column comb layout (matrix points done; outline + PCB scaffolded — WIP).
- `footprints/` — local mirror of the footprints this board uses (canonical copies live in
  `../ergogen-footprints`).

## Status

Early build. Done: generator chosen (**Cosmos**), **keywell geometry locked** (18 keys/hand,
18×17 Choc spacing, tenting 18°, curve 5/15 — source of truth in `cad/stactyl-cosmos-expert.ts`),
and a **firmware skeleton** stood up (`../zmk-config-stactyl`).

**Reoriented 2026-06-22:** controller **nice!nano → XIAO nRF52840 Plus**, fab **JLC DNP → Seeed
Fusion turnkey**, wiring **direct-pin → matrix + diodes**, and **per-key + underglow RGB added**.
Geometry and the flex-plate concept are unchanged. The firmware skeleton (cloned from xiphos,
direct-pin) now needs re-basing on the tbkmini matrix shield + `xiao_ble//zmk`.

STEP/STL export is **done** (`cad/*.step`/`.stl`); the comb `config.yaml` points are stood up. Still
to do, roughly in order: firmware retarget; dial the comb column staggers + build the ergogen
**outline** (column strips + serpentine necks + rigid root); footprints (XIAO Plus, SK6805-1515);
**the actual PCB — KiCad layout + matrix/RGB routing, both halves on one board, schematic sync, then
KiKit panelization**; MCU/LiPo/USB pockets + the stow CAD; the RGB chain topology / battery details;
and a Seeed Fusion quote + all-SMD BOM audit. See the TODO list in `CLAUDE.md`.

## License

Original work © Hunter Cook. TBK Mini geometry is a **reference target only** (BastardKB,
CC BY-NC-SA 4.0) — stactyl is generated clean-room, not copied from their files.
