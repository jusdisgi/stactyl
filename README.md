# stactyl

A **portable, stowable split ergonomic keyboard** — *"stacks + dactyl"*: a true 3D scooped
keywell that **clamshells into a minimum-volume stowed stack** for travel.

stactyl reuses the **3D column geometry of the BastardKB TBK Mini** (a Dactyl Manuform Mini) but
is a clean, fresh design built around:

- **36 keys** — 3×5 finger matrix + 1 outboard pinky + 2 thumbs, **per hand** (18/hand).
- **Kailh PG1316S** ultra-low-profile switches (consigned at JLCPCB, `C9900170245`).
- **nice!nano (nRF52840) per half, direct-pin wiring — no diodes, no matrix** (the `xiphos`
  recipe). Left half = split central.
- A **thin rigid FR-4 "flex-by-thinness" plate**: drawn one-switch-per-facet with thin FR-4
  necks, PCBA'd flat, then flexed once into the printed keywell on assembly. Standard rigid
  PCBA pipeline — no rigid-flex, no polyimide.
- A **printed 3D keywell** (from the **Cosmos** generator → STEP) that retains the switches and
  carries the formed plate.
- A **stow concept** that mates the two keywells past 180° to nest their convex hulls, held by
  matched magnet pads + a registration feature. Expect a chunky lens, not a pocketable clamshell.

## Toolchain note — two pipelines

Unlike every other board in `gittyup`, stactyl is **not** a pure-ergogen project, because ergogen
is 2D and cannot model a keywell.

- **Keywell / 3D shell:** generated in **Cosmos** (`ryanis.cool/cosmos`), exported as STEP,
  finished in CAD (Fusion/OnShape). See `cad/`.
- **Flat-plate PCB:** ergogen still lays out the **flat developed facet pattern** (`config.yaml`),
  using arc-length facet spacing derived from the Cosmos per-key planes so the board lands on the
  posts when bent. Routed in KiCad. PCBA + KiKit panelization as usual.

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
- `config.yaml` — ergogen flat-plate scaffold (developed facet layout — WIP).
- `footprints/` — local mirror of the footprints this board uses (canonical copies live in
  `../ergogen-footprints`).

## Status

Kickoff. Geometry generator chosen (**Cosmos**) and a starting PG1316S parameter set captured;
keywell, flat-plate facet/neck layout, thumb/pinky placement, stow CAD, and firmware are all
still to do. See the TODO list in `CLAUDE.md`.

## License

Original work © Hunter Cook. TBK Mini geometry is a **reference target only** (BastardKB,
CC BY-NC-SA 4.0) — stactyl is generated clean-room, not copied from their files.
