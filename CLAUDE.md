# CLAUDE.md — stactyl  *(name = "stacks" + "dactyl"; it stacks to stow)*

Notes for future sessions. Workspace-wide conventions live in `../CLAUDE.md`; this file holds only
what's specific to **stactyl**. Keep it thin. This is a **design brief / kickoff** — nothing is built
yet. Core decisions were settled with Hunter on 2026-06-18; open items are marked TODO.

> **Reorientation 2026-06-22.** Three foundational decisions flipped after the Planck-C75 thread
> worked out a **fully-assembled (turnkey) path at Seeed Fusion**: controller **nice!nano → XIAO
> nRF52840 Plus**, fab/assembly **JLCPCB DNP-and-hand-solder → Seeed Fusion machine-assembled**, and
> wiring **direct-pin → matrix + diodes**. RGB was also added (**per-key + underglow**). The geometry
> (Cosmos keywell, 18 keys/hand) and the thin-FR-4 flex-plate concept are **unchanged**. Sections
> below reflect the reorientation; see "Why XIAO Plus + Seeed" for the rationale.

## What this is

A new **portable / stowable split ergo** inspired by the **TBK Mini** — which is a Bastard Keyboards
**Dactyl Manuform Mini** (a true 3D scooped keywell, *not* a flat board). Hunter owns a wireless 3×5
ZMK clone of it (firmware lives in `../zmk-config-tbkmini`). stactyl reuses that board's **3D column
geometry** but is its own clean design: low-profile switches, fully PCBA-able, and built to **clamshell together
into a minimum-volume stowed stack** for travel.

## Layout (36 keys/board total)

- **3×5 finger matrix per hand**, in the **same 3D positions as the TBK Mini** keywell (inner 5
  columns; the original is 3×6 — drop the outer column). Match TBK Mini column stagger / curvature /
  tenting as the geometry target.
- **+1 outboard pinky key per hand**, like `../xiphos` / TOTEM (anchored off the pinky home column).
- **2 thumb keys per hand** (the original/clone has 3 — we drop to 2). TODO: exact 2-key thumb
  position/angle.
- Per hand: 15 + 1 + 2 = **18 keys → 36 total**. (Same count as `zmk-config-tbkmini` and `zmk-config-xiphos`; firmware adapts
  trivially — **matrix** like tbkmini as of the 2026-06-22 reorientation, not direct-pin; see Switches & controller.)

## Switches & controller

- **Kailh PG1316S** ultra-low-profile, **consigned at Seeed Fusion** (`C9900170245`, Hunter's reel —
  consignment relationship moves from JLC to Seeed for this board; see Production).
- Switch retention is by the **printed keywell plate**, not the PCB (see PCB approach) — the low
  PG1316S stack lets the keywell scoop stay shallow, which is what makes the thin-FR-4 plate viable.
- **Controller: XIAO nRF52840 Plus, one per half, machine-reflowed at Seeed** (castellated SMD-down,
  including the back-side pads the Plus adds). **left = split central** (workspace convention). LiPo
  per half. The Plus is **Seeed's own catalog part**, so it's placed turnkey — *not* DNP, *not*
  hand-soldered. Direct-soldered permanence is fine (Hunter direct-solders MCUs anyway). TODO:
  controller + cell pocket placement under the keywell. **NB:** the MCU is placed by *us* in custom
  CAD, **not** by the keywell generator — Cosmos's auto MCU holder + connector are deliberately
  disabled in the Expert config (didn't fit the tight shell, adds stow bulk). The case exposes the
  XIAO's **own USB-C port** for charge/flash — no separate connector. (XIAO is much smaller than a
  nice!nano — a win for the tight shell and stow volume.)
- **Wiring: matrix + diodes** (machine-placed at Seeed). A ~5×4 matrix per half = ~9 GPIO + one
  SOD-323 diode per key. Chosen over direct-pin specifically because the thin-FR-4 **necks** carry
  far fewer converging traces in a matrix than direct-pin's ~18 (see PCB approach), and turnkey
  assembly removes direct-pin's only real advantages — the diode BOM and the diode-direction risk
  that bit the tbkmini hand-build are both non-issues when a pick-and-place sets diodes in the
  footprint orientation. Frees ~10 GPIO for RGB data + headroom. Firmware base flips to the
  `../zmk-config-tbkmini` matrix shield (not xiphos's direct-pin).
- **RGB: per-key + underglow addressable LEDs — part LOCKED 2026-06-22 = SK6805-1515 (EC15)**, LCSC/JLC
  `C2890035` (OPSCO). **Mounted top-side in the switch's center cutout, single-sided — exactly the
  LightFury pattern** (LightFury places a 4-pad 2020 in the PG1316S cutout; see its `config.yaml`
  `led_*` params + `led_ws2812b_2020` footprint). Datasheet: **VDD 3.7–5.5 V** → runs straight off LiPo,
  **no boost circuit** (the whole reason for an SK part over WS2812B); single-wire WS2812 protocol →
  unchanged ZMK driver + **one** data line. Chosen as the **5 mA** current version (SK68**05**) over the
  12 mA SK6812 and over the 2.0×2.0 SK6812-2020: at **1.5×1.5 mm** it's smaller (more strip room for the
  diode) and draws ~⅓ the current — directly easing the battery cost, which is the real per-key-RGB
  penalty on a wireless nRF board. Trade-off: lower current = dimmer, fine for the in-cutout glow we want
  (SC caps are opaque; per-key reads as a halo around the cap, not backlit legends). **Footprint note:**
  EC15 pad order is **1=DIN, 2=VDD, 3=DOUT, 4=GND** — differs from the 2020, so use an EC15-matched
  footprint, don't blindly reuse LightFury's 2020 pad mapping. **Seeed-supply check:** `C2890035` is a
  JLC/LCSC catalog part — confirm it's in Seeed's catalog or plan to consign it (JLC stock ≠ Seeed stock).
  No encoder, no trackball.

### Why XIAO Plus + Seeed (reorientation 2026-06-22; supersedes the 2026-06-18 nice!nano choice)

The 2026-06-18 design picked nice!nano + JLC + direct-pin and **rejected the XIAO Plus** for two
reasons: (1) the Plus's extra GPIO sit on back-side pads needing **reflow**, not iron-friendly, and
(2) JLC would only **consign** the XIAO. The Planck-C75 thread found the path that dissolves both:
**fully-assembled (turnkey) at Seeed Fusion.**

- **Reflow objection → gone.** Machine reflow at Seeed is exactly what the back-side castellated pads
  want; that's the assembly house's job, not a hand-soldering chore.
- **Consignment objection → gone.** The XIAO is **Seeed's own catalog part**, so there's **zero MCU
  consignment** — Seeed already stocks and places it. We consign only the PG1316S reel.
- **GPIO.** The Plus breaks out ~19 usable GPIO. A ~5×4 matrix needs only ~9, leaving ample headroom
  (RGB data, future features). (Direct-pin's 18 would also fit, but matrix routes the necks better —
  see PCB approach — and turnkey assembly makes the diodes free, so matrix wins outright now.)
- **Net:** the design the old notes filed as a "future variant... superior in every way, if only the
  parts could be sourced at the same fab house" — XIAO Plus, machine-assembled — is now the **primary
  design**, because Seeed *is* that house. The end state is a **turnkey, fully-assembled board** (no
  DNP, no hand-solder), which is a strict upgrade over JLC-DNP-and-hand-solder.

**Permanence note:** SMD-down means the controller is not socketed/removable. Accepted — Hunter
already direct-solders MCUs (cf. xiphos/slim's slotted nano), so this changes nothing for him.

**Watch-list fallback (not the plan):** base XIAO nRF52840 (`C37327670`, 11 GPIO) at JLC is the only
turnkey-at-JLC option, but it forces the matrix anyway and has had stock/MOQ problems. Seeed + Plus is
cleaner on every axis, so JLC is the fallback only if a Seeed Fusion quote doesn't pan out.

## PCB approach — THE key decision (settled; layout model confirmed 2026-06-22)

**Thin rigid FR-4 "flex-by-thinness" plate, built as a BastardKB-style per-column COMB.
NOT a polyimide flex circuit, NOT rigid-flex, NOT a grid of facets.**

Ordered as **standard FR-4 at 0.6 mm** (0.8 mm fallback) — the normal rigid PCBA pipeline, just thin
enough to bend into place by hand. "Flexible" = thin, not a flex material. This is exactly how the
BastardKB Charybdis / TBK Mini flex plates are built (Hunter's reference; confirmed the model with him
2026-06-22 after first mis-imagining a full grid).

**Topology — a comb (per the Charybdis plate):**
- **Each column is one continuous strip** carrying its 3 keys at 17 mm row pitch. The strip is
  **full-width** and flexes along the column scoop **in the gaps between switches** — *no neck-down
  between rows* (the switch pads stiffen each key; bending happens in the inter-key gaps, like BastardKB).
- **Adjacent columns are joined by a single serpentine neck**, alternating top/bottom edge along the
  hand. The serpentine gives strain relief and lets each column sit at its own splay / stagger / height
  when bent.
- **A rigid controller root** at the proximal edge carries the **XIAO nRF52840 Plus + power/reset +
  battery connector**, reflowed onto the *same* board; the inner column necks into it and it **folds
  under into the keywell pocket** (the printed pocket supports it). This is what makes each half a
  **single turnkey PCBA** — no separate controller board, no board-to-board connector. NB: still **one
  uniform 0.6 mm FR-4 sheet, not rigid-flex** — "rigid root" just means a solid, neck-free region that
  stays flat and holds the heavy parts.
- **Outboard pinky** necks off the pinky strip; the **2-key thumb cluster** is its own short strip on a
  longer serpentine tail off the root (steep thumb plane, far from the fingers).

**Why a comb and not a grid:** a flat grid is **not developable** onto a compound-curved surface —
bending down the columns *and* across the rows at once shears the copper and buckles. A comb sidesteps
it: each strip bends only one way (its column), and the necks decouple the columns. This also **kills
the "developed / arc-length unfold" problem** — within a column it's just 17 mm row pitch; the
inter-column slack is taken up by the necks. **So the flat layout is basically a staggered-column grid
(like Hunter's other boards) + necks + root, not a novel unfold.**

**Maps cleanly onto matrix + RGB:**
- **Column lines run up each strip and never cross a neck.** The **row lines + the RGB chain + 5V/GND**
  are the only nets crossing the necks — a small bundle (~rows + 3), which is exactly why matrix suits
  this comb (vs direct-pin's many converging lines). This is the real reason the necks are fine.
- **RGB = one serial SK6805-1515 chain** snaking the comb (up a column, across a neck, down the next;
  LED in each switch cutout), terminating at the root — the LightFury snake pattern.

Why this path: stays **100% inside Hunter's existing rigid-FR-4 / consigned-PCBA / KiKit flow** with
**no rigid-flex premium** and no "can I consign on a flex order?" risk.

Caveats / design tasks:
- **The necks are the fragile bit.** Thin FR-4 cracks copper if a neck over-bends. We control the
  keywell (shallow scoop for PG1316S), so size each serpentine for its bend and keep within FR-4
  tolerance. Validate per-neck bend before ordering.
- **Neck count is low** — one per column gap + outboard + thumb tail — far more tractable than the
  abandoned grid, and each neck carries only the row/RGB/power bundle.
- **Facet real estate is a non-issue now.** LED sits in the switch cutout; the SOD-323 diode tucks
  beside each switch on its (wide) strip — no grid necks competing for space.
- Fallback with **zero redesign**: the identical comb can be re-ordered as true polyimide flex if
  durability ever demands it. Start thin-FR-4.

## Case / keywell geometry

- **Generate a fresh low-profile Dactyl** dialed for PG1316S height + spacing, using **TBK Mini
  column angles as the target** (not a precise match — Hunter likes the TBK feel but exact match
  is *not* required, confirmed 2026-06-18; PG1316S ergonomics win where they conflict).
- **Generator: Cosmos** (`ryanis.cool/cosmos`), decided 2026-06-18. Chosen over Dactyl-Manuform /
  Dometyl because stactyl's two downstream needs are what differ: (1) the **stow CAD** (nest
  hulls + magnet-pad booleans) needs clean **STEP** — Cosmos exports stable multi-part STEP into
  Fusion/OnShape; the OpenSCAD generators emit meshes that are painful for boolean work; (2) the
  **flat-plate column layout** is informed by the **per-key transforms**, which Cosmos **Expert mode**
  exposes as editable JS — the bridge to the ergogen comb staggers (not an arc-length unfold; see PCB
  approach). Plus native
  low-profile support and no opam/Clojure toolchain. Caveat: Cosmos has no PG1316S — use **Choc V1**
  as the Z-height/socket proxy (retention is the printed plate anyway).
- **Starting parameter set captured in `cad/keywell-params.md`** (DM-Mini lineage: column curve
  15° / row curve 5° / tent ~18°, center col = ring, PG1316S 17×17 spacing). It's a starting
  point to dial against the physical TBK, not a clone.
- **Toolchain note:** **ergogen is 2D and cannot model a keywell** — this breaks from every other
  board in gittyup. The keywell case comes from a dactyl generator / CAD, *not* ergogen. ergogen can
  still lay out the **flat plate PCB pattern** (the per-column comb — staggered-column strips + necks;
  the necks absorb the curvature when bent, so no arc-length unfold needed), but the 3D shell is a
  separate CAD job.

## Stow / mate concept (settled direction, geometry TBD in CAD)

- **Goal: minimum stowed volume.** Mate keywell-to-keywell but **rotate *past* 180°** to tuck each
  half's thumb cluster into the other's negative space — i.e. **nest the two convex hulls** (spoon
  the bumps into the hollows), not a clean flip. Exact rotation/offset is a packing optimization done
  on the real keywell solid.
- **Mating hardware = added geometry, not the generated rim.** A tucked pose has no planar rim, and we
  don't want one (a flat face costs back the volume). Instead, model both halves **in the stowed pose**
  in one assembly and add **matched local landing pads**: a small flat magnet boss on each half that
  is coincident with its counterpart in the stow pose (cut each as the negative of the other →
  guaranteed congruent). 2–3 pad-pairs + a **registration feature** (pin-and-socket / keyed nub) for
  one-way seat + shear resistance. Escalation ladder if pads aren't enough: matched pads → partial
  complementary skirt → full flat sole (simplest, most volume cost).
- Set expectations: a stowed pair of dactyl bowls is a **chunky lens** (portable, not pocketable) —
  nothing like xiphos/slimsplaydy's <9 mm clamshell.
- TODO decide: do interleaved keycaps lightly pressing in the stow pose become a bug, or a free
  "sleeps while stowed" feature (cf. xiphos clamp-to-sleep)?

## Reuse (don't reinvent)

- **`../ergogen-footprints`**: `switch_pg1316s`, `diode_smd_sod323f` (now **part of the design** — one
  per key for the matrix), `power_switch_smd_side`, `reset_switch_smd_side`, `magsafe_silkscreen`,
  `mounting_hole_npth`.
  - **MCU footprint: need a XIAO nRF52840 Plus footprint** — the Plus exposes the extra back-side
    castellated pads, so a plain XIAO BLE footprint won't do. Source from the `../XIAO KiCad` /
    `../marbastlib` / ceoloide libs or build a Plus footprint in `../ergogen-footprints`. (The old
    `mcu_nice_nano_smd` slotted footprint is no longer relevant.)
  - **RGB footprint:** **SK6805-1515 (EC15)** footprint, `C2890035` (per-key in the switch cutout +
    underglow). Reuse LightFury's `led_ws2812b_2020` *placement* pattern (in-cutout `led_pos` offset,
    the up/dn rotate-for-routing trick, diode shift), but build/adapt a 1515 footprint with EC15 pad
    order (1=DIN 2=VDD 3=DOUT 4=GND) — don't reuse the 2020 pad geometry directly.
- **`../slimsplaydy` + `../xiphos` PCBA flow**: consigned-reel BOM/CPL, KiKit multiboard panelization,
  the embedded-magnet + registration clasp pattern (adapt to 3D pads here). **Order config differs:**
  Seeed Fusion turnkey, not JLC-DNP (see Production).
- **Firmware base:** start from **`../zmk-config-tbkmini`** (the **matrix** shield) — the right match
  now that stactyl is matrix-wired. `../zmk-config-xiphos` (direct-pin) is no longer the base. Reuse
  the sweep-pro keymap lineage either way. Board target = `xiao_ble//zmk` (not nice_nano).
- **BastardKB TBK Mini** (geometry + plate PCB) as a **reference only**. License is **CC BY-NC-SA
  4.0** — *prefer generating fresh (clean-room) over copying their files* so stactyl isn't encumbered
  by NC/SA; the column geometry is a *target*, not a copied asset. Non-commercial anyway = fine for
  Hunter's personal use; just don't sell derivatives of their files.

## Production (Seeed Fusion PCBA — turnkey)

**Breaks from the slimsplaydy/xiphos JLC model** — this is the board where we go fully assembled.

- **Fab + assembly at Seeed Fusion**, **fully assembled / turnkey** — no DNP, no hand-solder. The
  XIAO Plus is Seeed's catalog part (machine-placed); diodes + RGB LEDs machine-placed; **PG1316S
  consigned `C9900170245`** (consignment moves JLC → Seeed for this board).
- **"Full stop" requires an all-SMD, machine-placeable BOM.** Audit every part and swap to
  Seeed-stocked equivalents where easier (Hunter has no religion on the battery connector). Confirm
  the power switch, reset switch, and battery connector are all SMD or accept Seeed's THT line. The
  current JLC refs (Molex Pico-EZmate `C505023`, power `C2911519`, reset `C79174`) are LCSC/JLC part
  numbers — **re-source against Seeed's catalog**.
- **Get a written Seeed Fusion quote** covering consigned PG1316S + turnkey XIAO Plus + thin FR-4 in
  one order — everything rests on that assumption. Order the Plus units for stactyl **and** the Planck
  build together.
- Panelize with **KiKit** (on Hunter's machine) after routing — fab-agnostic, unchanged. Order the
  plate at **0.6 mm FR-4** (0.8 mm fallback if 0.6 mm bends too hard for the scoop).

## Open items / TODO

- [x] Pick dactyl generator + capture the PG1316S parameter set (match TBK Mini columns).
      **Cosmos**; starting params in `cad/keywell-params.md`. 2026-06-18.
- [x] Build the Cosmos model + capture Expert per-key transforms. 2026-06-18. Geometry **locked**:
      `cad/stactyl-cosmos-expert.ts` is the source of truth (18×17 Choc spacing, tenting 18°,
      curve 5/15, 18 keys/hand, 1u outboard pinky). **STEP/STL export DONE 2026-06-19**
      (`cad/stactylleft/right.step` + case/plate STLs). Scoop-depth-vs-neck-bend validation still open.
- [ ] **(ergogen) Per-column comb layout + outline.** `config.yaml` points are stood up (5 finger
      columns + outboard pinky + 2 thumbs, matrix nets); next: dial the column staggers against the
      Cosmos transforms + a bent test print, then build the **outline** — one full-width strip per
      column, single serpentine necks between columns (alternating top/bottom), the rigid root, the
      outboard-pinky stub, and the thumb tail. Orient each neck's hinge + validate bend angle vs FR-4
      tolerance. Diode tucks beside each switch on its strip (LED sits in the switch cutout). Produces
      the outline + footprint placement, *not* a routed board.
- [ ] **Footprints (prereq for the PCB).** Inventory of `../ergogen-footprints` (2026-06-22):
      `diode_smd_sod323f` ✅, `switch_pg1316s` ✅, and XIAO Plus helpers ✅
      (`xiao_ble_plus_breakout_holes`, `util_xiao_ble_plus_cutout[_simple]`). **Missing: an EC15 LED
      footprint** — only `led_ws2812b_2020` exists; create an **SK6805-1515 / EC15** footprint (1.5×1.5,
      pad order 1=DIN 2=VDD 3=DOUT 4=GND) via kicad2ergogen, edit in `../ergogen-footprints` first then
      mirror in. Confirm the XIAO Plus helpers compose into a full solder-down footprint (vs needing a
      base `mcu_xiao` footprint). Local `footprints/` still carries the stale `mcu_nice_nano_smd.js` —
      remove once the XIAO Plus footprint is mirrored in.
- [ ] **PCB layout + routing (KiCad) — the core build job.** From the comb layout: place
      switch + in-cutout LED + diode per key on each column strip, then route the ~5×4 matrix + RGB
      power/data through the necks (both copper layers; necks nearest the root are busiest), the XIAO
      Plus breakout on the root, and
      power/reset/battery. **Both halves on one `.kicad_pcb`** (two closed Edge.Cuts outlines, `L_`/`R_`
      nets) per workspace convention. DRC clean before panelizing.
- [ ] **Schematic build/sync.** ergogen emits no schematic — build per `Schematics_and_Ergogen.md`
      (match refs/pins/nets to the ergogen PCB, then KiCad *Update Schematic from PCB*). Needs symbols
      for the XIAO Plus + SK6805-1515 (add to `huntercook.kicad_sym` / `${HLC_SYMBOLS}` if missing).
- [ ] **Panelize (KiKit) for the Seeed order.** Multiboard panel — route first, panelize after — on
      Hunter's machine (KiKit runs against pcbnew). Rails / mouse-bites / fiducials / tooling holes per
      the standard flow; frame wraps the final routed outline.
- [x] Finalize 2-key thumb cluster + outboard pinky positions. 2026-06-18. Curved 2-key thumb;
      outboard pinky = 1u (custom rounded/tri caps + case clearance to be done in CAD).
- [x] ~~Controller + wiring: nice!nano, direct-pin, no diodes (xiphos recipe). 2026-06-18.~~
      **SUPERSEDED 2026-06-22 → XIAO nRF52840 Plus + matrix + diodes, turnkey at Seeed.** See
      "Why XIAO Plus + Seeed."
- [ ] **Controller + LiPo + USB pocket (custom CAD, decoupled from Cosmos).** Cosmos's auto MCU
      holder + connector are nulled in the Expert config (didn't fit the tight shell + stow-volume
      goal). On the exported STEP we model: a **XIAO Plus pocket** (smaller than nice!nano), a LiPo
      pocket, and a USB-C cutout aligned to the **XIAO's** onboard port (charges/flashes through that
      port — no separate connector).
- [ ] Stowed-pose CAD assembly → matched magnet pads + registration; settle rotation/offset.
- [ ] **Firmware retarget (reorientation).** `zmk-config-stactyl` was cloned from xiphos (direct-pin,
      `nice_nano//zmk`); **re-base on `zmk-config-tbkmini` (matrix), board target `xiao_ble//zmk`,
      `kscan-gpio-matrix` + diodes.** Pins still PLACEHOLDER until the PCB is routed. (Original
      2026-06-18 direct-pin skeleton is now wrong wiring.)
- [ ] **RGB scope (added 2026-06-22; part LOCKED = SK6805-1515 / EC15 `C2890035`, top-side in switch
      cutout per LightFury).** Remaining: build/adapt the EC15 footprint (pad order 1=DIN 2=VDD 3=DOUT
      4=GND), per-key + underglow chain topology + data pin, ZMK RGB config, battery budget / cell size,
      and the Seeed supply check (catalog vs consign).
- [ ] **Seeed Fusion quote + BOM audit.** Written quote for consigned PG1316S + turnkey XIAO Plus +
      thin FR-4; audit BOM to all-SMD and re-source parts against Seeed's catalog. Order Plus units
      with the Planck build.
- [x] Name: **stactyl** (stacks + dactyl). 2026-06-18.
- [x] **git:** both repos created + pushed 2026-06-18 — `jusdisgi/stactyl` (incl. the locked
      Cosmos geometry + design docs) and `jusdisgi/zmk-config-stactyl` (firmware skeleton). Ongoing
      work = normal commits. Per workspace policy, **never run git** — Hunter runs them.
