# stactyl

A **portable, stowable split ergonomic keyboard** — *"stacks + dactyl"*: a true 3D scooped
keywell that **clamshells into a minimum-volume stowed stack** for travel.

stactyl reuses the **3D column geometry of the BastardKB TBK Mini** (a Dactyl Manuform Mini) but
is a clean, fresh design built around:

- **36 keys** — 3×5 finger matrix + 1 outboard pinky + 2 thumbs, **per hand** (18/hand).
- **Kailh PG1316S** ultra-low-profile switches (consigned at JLCPCB, `C9900170245`).
- **Regular XIAO nRF52840 BLE per half, matrix wiring + diodes** (the `tbkmini` recipe). Left half =
  split central. **Fully assembled (turnkey) at JLCPCB** — JLC places the XIAO from stock
  (`C17209540`), so no DNP and no hand-soldering. (Not the Plus — the matrix fits the regular XIAO's
  11 GPIO: 9 matrix + 1 RGB data + 1 LED-rail enable.)
- **Per-key + underglow addressable RGB** — **SK6805-1515 (EC15)**, `C2890035` (machine-placed,
  top-side in the switch center cutout per LightFury; single-wire, runs off LiPo with no boost; the
  5 mA / 1.5×1.5 mm low-power variant, chosen for battery life + strip space). LED rail gated by a
  **P-ch MOSFET (AO3401A, `C15127`)** off ZMK `ext-power` so it draws nothing when idle.
- A **thin rigid FR-4 "flex-by-thinness" plate**, built as a **BastardKB-style per-column comb**:
  each finger column is one full-width strip, columns joined by single serpentine necks, terminating
  at a rigid controller root (regular XIAO BLE) that folds into the keywell pocket. PCBA'd flat, then bent
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

**Reoriented 2026-06-22, amended 2026-06-23:** controller **nice!nano → regular XIAO nRF52840 BLE**,
fab **JLC DNP → JLC turnkey** (fully assembled — JLC places the XIAO), wiring **direct-pin → matrix +
diodes**, **per-key + underglow RGB added** (SK6805-1515 + AO3401A LED switch). The brief Seeed +
XIAO-Plus detour is reversed (matrix fits the regular XIAO's 11 GPIO; JLC is cheaper + in stock).
Geometry and the flex-plate concept are unchanged.

STEP/STL export is **done**; the comb `config.yaml` points are stood up; the **firmware retarget is
done** (matrix on `xiao_ble//zmk`, builds green). Still to do, roughly in order: dial the comb column
staggers + finish the ergogen **outline** (column strips + serpentine necks + rigid root); footprints
(regular XIAO, SK6805-1515, AO3401A); **the actual PCB — KiCad layout + matrix/RGB routing, both
halves on one board, schematic sync, then KiKit panelization**; MCU/LiPo/USB pockets + stow CAD; RGB
chain + ext-power; and a JLC BOM audit. See the TODO list in `CLAUDE.md`.

## License

Original work © Hunter Cook. TBK Mini geometry is a **reference target only** (BastardKB,
CC BY-NC-SA 4.0) — stactyl is generated clean-room, not copied from their files.
