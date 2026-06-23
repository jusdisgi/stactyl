# CLAUDE.md — stactyl  *(name = "stacks" + "dactyl"; it stacks to stow)*

Notes for future sessions. Workspace-wide conventions live in `../CLAUDE.md`; this file holds only
what's specific to **stactyl**. Keep it thin. This is a **design brief / kickoff** — nothing is built
yet. Core decisions were settled with Hunter on 2026-06-18; open items are marked TODO.

> **Reorientation 2026-06-22, amended 2026-06-23.** The 2026-06-22 pass flipped: controller
> **nice!nano → XIAO nRF52840**, wiring **direct-pin → matrix + diodes**, and added **per-key +
> underglow RGB**. It *also* routed through a **Seeed Fusion turnkey + XIAO Plus** plan — **that part is
> REVERSED as of 2026-06-23**:
> - **Controller = regular XIAO nRF52840 BLE** (not the Plus). The matrix needs only ~9 GPIO, so the
>   regular XIAO's 11 GPIO suffice — the Plus was only ever for the abandoned direct-pin's 18 pins.
> - **Fab/assembly = JLCPCB turnkey** (not Seeed). JLC turnkey-places the regular XIAO from stock
>   (`C17209540`, pre-order, **MOQ 1**, ~$16); the Plus is reel-only (~$4k) and Seeed quoted >2× JLC.
>   PG1316S consignment stays at **JLC** (back to Hunter's normal flow).
> The geometry (Cosmos keywell, 18 keys/hand) and the thin-FR-4 flex-plate concept are **unchanged**.
> See "Why regular XIAO + JLC" for the rationale.

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

- **Kailh PG1316S** ultra-low-profile, **consigned at JLCPCB** (`C9900170245`, Hunter's reel — his
  normal flow; see Production).
- Switch retention is by the **printed keywell plate**, not the PCB (see PCB approach) — the low
  PG1316S stack lets the keywell scoop stay shallow, which is what makes the thin-FR-4 plate viable.
- **Controller: regular XIAO nRF52840 BLE, one per half, JLC turnkey-placed** (`C17209540`, pre-order,
  MOQ 1, ~$16 — JLC sources + places it from stock). **left = split central** (workspace convention).
  LiPo per half. **NOT the Plus** — the matrix only needs ~9 GPIO, so the regular XIAO's 11 are enough
  (the Plus was a direct-pin-era idea; see "Why regular XIAO + JLC"). TODO: controller + cell pocket
  placement under the keywell. **NB:** the MCU is placed by *us* in custom CAD, **not** by the keywell
  generator — Cosmos's auto MCU holder + connector are deliberately disabled in the Expert config
  (didn't fit the tight shell, adds stow bulk). The case exposes the XIAO's **own USB-C port** for
  charge/flash — no separate connector. (XIAO is much smaller than a nice!nano — a win for the tight
  shell and stow volume.)
- **Wiring: matrix + diodes.** A **5×4 matrix per half = 9 GPIO** (5 cols + 4 rows) + one SOD-323
  diode per key. Chosen over direct-pin specifically because the thin-FR-4 **necks** carry far fewer
  converging traces in a matrix than direct-pin's ~18 (see PCB approach), and turnkey assembly makes
  the diode BOM + diode-direction (which bit the tbkmini hand-build) non-issues. Firmware base is the
  `../zmk-config-tbkmini` matrix shield (not xiphos's direct-pin).
- **Pin budget (regular XIAO, 11 GPIO, exactly full):** 9 matrix + **1 RGB data** + **1 LED-rail
  enable** (see RGB) = 11. No spare, but it fits. (TOTEM proves a 36-key matrix split on the regular
  xiao_ble.)
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
  footprint, don't blindly reuse LightFury's 2020 pad mapping. `C2890035` is a JLC catalog part (turnkey,
  no consignment). No encoder, no trackball.
- **LED-rail power switch (idle-draw kill).** A proper **high-side switch** gates power to the whole
  SK6805 chain so the LEDs draw **zero** when off (addressable LEDs sink quiescent current even
  "off"). WalkThePlanck's refined two-FET circuit (mirror it):
  - **Q1 = AO3401A** — P-ch high-side switch on the LED rail. `C15127`, JLC **Basic** (no
    extended-part fee; cheaper in practice than the Extended FS3401M `C2936839` once the ~$3/part
    loading fee counts).
  - **Q2 = 2N7002** — N-ch gate **driver**. A 3.3 V GPIO can't pull Q1's gate up to the LiPo rail to
    turn it *off* (gate must reach ~V_rail), so Q2 level-shifts: GPIO drives Q2, Q2 pulls Q1's gate to
    GND. JLC Basic SOT-23 (likely `C8545` — confirm at BOM time).
  - **R1 = 10k** Q1 gate pull-up to the rail (default OFF); **R3 = 10k** Q2 gate pull-down (stays OFF
    while the GPIO floats/boots). Two 10k 0402s.
  - Behavior: **GPIO high → LEDs on** (Q2 on → Q1 gate low → Q1 on); GPIO low/floating → rail dead.
  - Driven by the **11th GPIO** via ZMK's **`ext-power`** node (active-high enable; ZMK cuts the rail
    on idle/sleep). Q1's huge margin (~4 A) dwarfs the ~0.3 A LED rail.
  - *(Related but separate: **R2 = 330R 0402** = SK6805 data-line series resistor — RGB support, not
    the gate.)*

### Why regular XIAO + JLC (2026-06-23; supersedes the brief 2026-06-22 "XIAO Plus + Seeed" detour)

For ~a day the plan was XIAO **Plus** assembled at **Seeed Fusion**. Two things collapsed that:

- **The matrix removed the need for the Plus.** The Plus's only draw was GPIO count, and that mattered
  only for the abandoned **direct-pin** wiring (18 pins). The board is **matrix** now: 9 matrix + 1 RGB
  data + 1 LED-enable = **11 GPIO = exactly a regular XIAO nRF52840 BLE.** (TOTEM is a 36-key matrix
  split on the regular xiao_ble — proof it fits.)
- **Sourcing + cost favor JLC + regular XIAO.** JLC turnkey-places the **regular** XIAO from stock
  (`C17209540`, pre-order, **MOQ 1**, ~$16). The **Plus** is **reel-only (~$4k)** — not orderable in
  2s. And a Seeed Fusion quote came back **>2× JLC** with an interface Hunter dislikes. So the regular
  XIAO at JLC is cheaper, in stock at qty 2, and back in Hunter's normal flow.

Note the original "JLC can't place the MCU → DNP/hand-solder" pain is specific to the **nice!nano**
(slimsplaydy/xiphos/LightFury), **not** the XIAO — JLC stocks + places the XIAO turnkey. So stactyl is
**fully assembled at JLC**, no DNP, no hand-solder, no consignment beyond the usual PG1316S reel.

(WalkThePlanck made the same Seeed→JLC pivot; see `[[seeed-turnkey-path]]` / `[[planck-c75-wireless-port]]`.)

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
- **A rigid controller root** at the proximal edge carries the **regular XIAO nRF52840 BLE + power/reset
  + battery connector + LED-switch MOSFET**, reflowed onto the *same* board; the inner column necks into it and it **folds
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
  - **MCU footprint: a regular XIAO nRF52840 (BLE) footprint** — the standard 2-row XIAO, no back-side
    pads (we're not using the Plus). Source from `../XIAO KiCad` / `../marbastlib` / ceoloide, or check
    whether `xiao_ble_breakout_holes` + a XIAO pad footprint in `../ergogen-footprints` already cover
    it. (`mcu_nice_nano_smd` is no longer relevant.)
  - **RGB footprint:** **SK6805-1515 (EC15)** footprint, `C2890035` (per-key in the switch cutout +
    underglow). Reuse LightFury's `led_ws2812b_2020` *placement* pattern (in-cutout `led_pos` offset,
    the up/dn rotate-for-routing trick, diode shift), but build/adapt a 1515 footprint with EC15 pad
    order (1=DIN 2=VDD 3=DOUT 4=GND) — don't reuse the 2020 pad geometry directly.
  - **LED-switch footprint group:** the WalkThePlanck high-side-switch block — **Q1 AO3401A** (P-ch,
    SOT-23, `C15127`) + **Q2 2N7002** (N-ch driver, SOT-23) + **R1/R3 10k 0402** (gate pull-up/down) +
    **R2 330R 0402** (SK6805 data series). Reuse WalkThePlanck's footprint + net pattern wholesale.
- **`../slimsplaydy` + `../xiphos` PCBA flow**: consigned-reel BOM/CPL, KiKit multiboard panelization,
  the embedded-magnet + registration clasp pattern (adapt to 3D pads here). Same **JLC turnkey** order
  flow, just fully-assembled (no DNP — the XIAO is JLC-placeable; see Production).
- **Firmware base:** start from **`../zmk-config-tbkmini`** (the **matrix** shield) — the right match
  now that stactyl is matrix-wired. `../zmk-config-xiphos` (direct-pin) is no longer the base. Reuse
  the sweep-pro keymap lineage either way. Board target = `xiao_ble//zmk` (not nice_nano).
- **BastardKB TBK Mini** (geometry + plate PCB) as a **reference only**. License is **CC BY-NC-SA
  4.0** — *prefer generating fresh (clean-room) over copying their files* so stactyl isn't encumbered
  by NC/SA; the column geometry is a *target*, not a copied asset. Non-commercial anyway = fine for
  Hunter's personal use; just don't sell derivatives of their files.

## Production (JLCPCB PCBA — turnkey)

Same JLC model as slimsplaydy/xiphos for fab, but **fully assembled** (the XIAO is JLC-placeable, so
no DNP/hand-solder — that pain was nice!nano-specific).

- **Fab + assembly at JLCPCB**, fully assembled — the **regular XIAO BLE** is placed turnkey from JLC
  stock (`C17209540`, pre-order, MOQ 1); diodes + RGB LEDs + LED-switch MOSFET machine-placed;
  **PG1316S consigned `C9900170245`** (the only consigned part, Hunter's normal flow).
- **All-SMD, machine-placeable BOM.** Confirm every part is JLC-stocked + SMD: XIAO `C17209540`,
  SK6805-1515 `C2890035`, SOD-323 diodes, LED switch **AO3401A `C15127`** (Basic), Molex Pico-EZmate
  `C505023`, power `C2911519`, reset `C79174`. Prefer **Basic** parts to avoid extended-part fees.
- Flow is Hunter's usual JLC turnkey (gerbers + CPL + BOM); no Seeed, no second consignment
  relationship. Order qty per usual.
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
- [ ] **Footprints (prereq for the PCB).** Inventory of `../ergogen-footprints`:
      `diode_smd_sod323f` ✅, `switch_pg1316s` ✅, regular-XIAO helpers ✅ (`xiao_ble_breakout_holes`,
      `util_xiao_ble_cutout[_simple]`). **Missing: an EC15 LED footprint** — only `led_ws2812b_2020`
      exists; create an **SK6805-1515 / EC15** footprint (1.5×1.5, pad order 1=DIN 2=VDD 3=DOUT 4=GND)
      via kicad2ergogen, edit in `../ergogen-footprints` first then mirror in. Also need a **SOT-23**
      footprint for the LED-switch MOSFET (AO3401A) — reuse WalkThePlanck's. Confirm the regular-XIAO
      helpers give a full solder-down footprint. Local `footprints/` still carries the stale
      `mcu_nice_nano_smd.js` — remove once the XIAO footprint is mirrored in.
- [ ] **PCB layout + routing (KiCad) — the core build job.** From the comb layout: place
      switch + in-cutout LED + diode per key on each column strip, then route the ~5×4 matrix + RGB
      power/data through the necks (both copper layers; necks nearest the root are busiest), the XIAO
      breakout + LED-switch MOSFET on the root, and
      power/reset/battery. **Both halves on one `.kicad_pcb`** (two closed Edge.Cuts outlines, `L_`/`R_`
      nets) per workspace convention. DRC clean before panelizing.
- [ ] **Schematic build/sync.** ergogen emits no schematic — build per `Schematics_and_Ergogen.md`
      (match refs/pins/nets to the ergogen PCB, then KiCad *Update Schematic from PCB*). Needs symbols
      for the XIAO BLE + SK6805-1515 + AO3401A (add to `huntercook.kicad_sym` / `${HLC_SYMBOLS}` if missing).
- [ ] **Panelize (KiKit) for the JLC order.** Multiboard panel — route first, panelize after — on
      Hunter's machine (KiKit runs against pcbnew). Rails / mouse-bites / fiducials / tooling holes per
      the standard flow; frame wraps the final routed outline.
- [x] Finalize 2-key thumb cluster + outboard pinky positions. 2026-06-18. Curved 2-key thumb;
      outboard pinky = 1u (custom rounded/tri caps + case clearance to be done in CAD).
- [x] ~~Controller + wiring: nice!nano, direct-pin, no diodes (xiphos recipe). 2026-06-18.~~
      **SUPERSEDED → regular XIAO nRF52840 BLE + matrix + diodes, JLC turnkey (2026-06-23).** See
      "Why regular XIAO + JLC."
- [ ] **Controller + LiPo + USB pocket (custom CAD, decoupled from Cosmos).** Cosmos's auto MCU
      holder + connector are nulled in the Expert config (didn't fit the tight shell + stow-volume
      goal). On the exported STEP we model: a **regular XIAO pocket** (smaller than nice!nano), a LiPo
      pocket, and a USB-C cutout aligned to the **XIAO's** onboard port (charges/flashes through that
      port — no separate connector).
- [ ] Stowed-pose CAD assembly → matched magnet pads + registration; settle rotation/offset.
- [x] **Firmware retarget — DONE 2026-06-23.** `zmk-config-stactyl` converted to `kscan-gpio-matrix`
      on `xiao_ble//zmk` (regular XIAO; `xiao_ble` is the regular target), modeled on
      `../zmk-config-totem`. Builds green. Pins + R3 cells still PLACEHOLDER until the PCB is routed.
- [ ] **Firmware RGB + ext-power.** Add the SK6805 `ws2812`/`zmk,underglow` config + data pin, and a
      **`zmk,ext-power`** node on the 11th GPIO (the AO3401A gate) so ZMK cuts the LED rail on
      idle/sleep. Mirror WalkThePlanck's ext-power setup.
- [ ] **RGB scope (part LOCKED = SK6805-1515 / EC15 `C2890035`, top-side in switch cutout).**
      Remaining: build/adapt the EC15 footprint (1=DIN 2=VDD 3=DOUT 4=GND), per-key + underglow chain
      topology + data pin, the LED-rail MOSFET switch (AO3401A `C15127`), and battery budget / cell size.
- [ ] **JLC BOM audit + order.** Confirm all parts JLC-stocked + SMD (prefer Basic): XIAO `C17209540`,
      SK6805 `C2890035`, 1N4148WT SOD-323 diodes, **LED-switch block** (AO3401A `C15127` + 2N7002 +
      2×10k 0402 + 330R 0402), EZmate `C505023`, power `C2911519`, reset `C79174`; PG1316S consigned
      `C9900170245`. NOTE: stactyl does **not** use WalkThePlanck's 74HC595 shift registers (that's its
      single-MCU unibody matrix expansion — stactyl is a per-half split with a direct 5×4 matrix).
      Standard JLC turnkey order (gerbers + CPL + BOM).
- [x] Name: **stactyl** (stacks + dactyl). 2026-06-18.
- [x] **git:** both repos created + pushed 2026-06-18 — `jusdisgi/stactyl` (incl. the locked
      Cosmos geometry + design docs) and `jusdisgi/zmk-config-stactyl` (firmware skeleton). Ongoing
      work = normal commits. Per workspace policy, **never run git** — Hunter runs them.
