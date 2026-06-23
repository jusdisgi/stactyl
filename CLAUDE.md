# CLAUDE.md — stactyl  *(name = "stacks" + "dactyl"; it stacks to stow)*

Notes for future sessions. Workspace-wide conventions live in `../CLAUDE.md`; this file holds only
what's specific to **stactyl**. Keep it thin. This is a **design brief / kickoff** — nothing is built
yet. Core decisions were settled with Hunter on 2026-06-18; open items are marked TODO.

> **Reorientation 2026-06-22, amended 2026-06-23.** The 2026-06-22 pass flipped: controller
> **nice!nano → XIAO nRF52840**, wiring **direct-pin → matrix + diodes**. Two later course-corrections:
> - **Controller = regular XIAO nRF52840 BLE + JLC turnkey** (the brief "XIAO Plus + Seeed" detour is
>   reversed). The matrix needs only ~9 GPIO, so the regular XIAO's 11 suffice; JLC turnkey-places it
>   from stock (`C17209540`, pre-order, **MOQ 1**, ~$16) — the Plus is reel-only (~$4k) and Seeed quoted
>   >2× JLC. PG1316S consignment stays at **JLC**. See "Why regular XIAO + JLC."
> - **RGB SHELVED 2026-06-23 → future variant.** Per-key + underglow addressable RGB was added then
>   pulled: routing the LED power/data through the 2-layer flex necks is painful, and LEDs fight this
>   board's portability/battery goal. The active design is **no-RGB**; the full LED design is preserved
>   in "Future variant — RGB (shelved)" below.
> The geometry (Cosmos keywell, 18 keys/hand) and the thin-FR-4 flex-plate concept are **unchanged**.

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
- **Pin budget (regular XIAO, 11 GPIO):** 9 matrix (5 cols + 4 rows) = **9 of 11, 2 spare.** (TOTEM
  proves a 36-key matrix split on the regular xiao_ble.) The 2 spare are free for a future variant.
- **No RGB, no encoder, no trackball.** Per-key + underglow addressable RGB was fully designed
  (SK6805-1515 + a 2-FET LED-rail switch) then **shelved to a future variant on 2026-06-23** — routing
  the LED power/data through the 2-layer flex necks is painful, and LEDs fight this travel board's
  battery/portability goal. The whole LED design is preserved below in **"Future variant — RGB
  (shelved)"**; the active board is **keys only**.

### Why regular XIAO + JLC (2026-06-23; supersedes the brief 2026-06-22 "XIAO Plus + Seeed" detour)

For ~a day the plan was XIAO **Plus** assembled at **Seeed Fusion**. Two things collapsed that:

- **The matrix removed the need for the Plus.** The Plus's only draw was GPIO count, and that mattered
  only for the abandoned **direct-pin** wiring (18 pins). The board is **matrix** now: just **9 GPIO**
  (5 cols + 4 rows), comfortably inside the regular XIAO nRF52840 BLE's 11. (TOTEM is a 36-key matrix
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
  + battery connector**, reflowed onto the *same* board; the inner column necks into it and it **folds
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

**Maps cleanly onto the matrix:**
- **Column lines run up each strip and never cross a neck.** Only the **row lines** cross the necks —
  ~4 traces per neck (now that RGB is shelved, that's *all* a neck carries). That's exactly why matrix
  suits this comb (vs direct-pin's many converging lines), and it makes the 2-layer routing easy.

Why this path: stays **100% inside Hunter's existing rigid-FR-4 / consigned-PCBA / KiKit flow** with
**no rigid-flex premium** and no "can I consign on a flex order?" risk.

Caveats / design tasks:
- **The necks are the fragile bit.** Thin FR-4 cracks copper if a neck over-bends. We control the
  keywell (shallow scoop for PG1316S), so size each serpentine for its bend and keep within FR-4
  tolerance. Validate per-neck bend before ordering.
- **Neck count is low** — one per column gap + outboard + thumb tail — far more tractable than the
  abandoned grid, and (RGB shelved) each neck now carries only **~4 row lines**.
- **Facet real estate is a non-issue.** Each strip holds only a switch + its SOD-323 diode (the diode
  tucks beside the switch on the wide strip) — no LED, no grid necks competing for space.
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
  - *(RGB footprints — the SK6805-1515 EC15 LED + the AO3401A/2N7002 LED-switch block — are shelved
    with the RGB variant; see "Future variant — RGB (shelved)".)*
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
  stock (`C17209540`, pre-order, MOQ 1); SOD-323 diodes machine-placed; **PG1316S consigned
  `C9900170245`** (the only consigned part, Hunter's normal flow).
- **All-SMD, machine-placeable BOM** (keys only — RGB shelved): XIAO `C17209540`, 1N4148WT SOD-323
  diodes, Molex Pico-EZmate `C505023`, power `C2911519`, reset `C79174`. Prefer **Basic** parts to
  avoid extended-part fees.
- **Stackup (decided 2026-06-23): 2-layer, 0.6 mm FR-4** (0.8 mm fallback), **ENIG** (flat pads for the
  fine-pitch PG1316S + castellated XIAO), **filled vias — epoxy-filled-&-capped (POFV), or JLC
  "plugged"**, standard Tg, 1 oz Cu. **Filled, NOT tented:** `switch_pg1316s` drops vias **in-pad**
  (`pad_vias`/`mp_vias`) and its own comment warns they "leak solder" — tented in-pad vias wick solder
  during reflow, so they must be filled (epoxy-filled-&-capped is the standard; "plugged" is the lighter
  validated option used on the PG1316S boards). **NOT 6-layer / not the LightFury stackup** — the plate
  has to *bend*, which needs thin 2-layer; 6-layer is too thick/stiff and the inner copper cracks on the
  fold. Keep necks as bare traces (no copper pour through a neck).
- Flow is Hunter's usual JLC turnkey (gerbers + CPL + BOM); no Seeed, no second consignment
  relationship. Panelize with **KiKit** (on Hunter's machine) after routing.

## Future variant — RGB (shelved 2026-06-23)

Per-key + underglow addressable RGB was fully worked out, then **shelved to a future variant**. Why
shelved: (1) routing the LED power + data chain through the thin 2-layer flex necks (on top of the
matrix rows) is painful and tightens an already-fragile neck; (2) addressable LEDs fight this board's
**portability/battery** identity. Preserved here so the variant is a drop-in later (it costs the 2
spare GPIO + a few parts; the comb/relief geometry is unchanged):

- **LED:** **SK6805-1515 (EC15)**, JLC `C2890035`. Single-wire WS2812 protocol; **VDD 3.7–5.5 V** so it
  runs off LiPo with no boost; the **5 mA** low-power variant (vs SK6812's 12 mA); 1.5×1.5 mm. Mounted
  **top-side in the PG1316S center cutout** (LightFury pattern), one serial chain snaking the comb.
  EC15 pad order **1=DIN 2=VDD 3=DOUT 4=GND** (differs from the 2020 — build an EC15-matched footprint,
  don't reuse LightFury's `led_ws2812b_2020` pad geometry; *do* reuse its placement pattern).
- **LED-rail power switch** (idle-draw kill — addressable LEDs sink quiescent current even "off").
  WalkThePlanck's 2-FET high-side switch: **Q1 AO3401A** P-ch (`C15127`, JLC Basic) on the rail +
  **Q2 2N7002** N-ch gate driver (a 3.3 V GPIO can't pull Q1's gate to the LiPo rail to turn it off, so
  Q2 level-shifts) + **R1/R3 10k 0402** (Q1 gate pull-up, Q2 gate pull-down) + **R2 330R 0402** (data
  series). Behavior: GPIO-high = LEDs on. Driven by a spare GPIO via ZMK **`zmk,ext-power`** (active-high).
- **Pins:** +1 RGB data +1 LED-enable = the 2 spare GPIO (back to 11/11 on the regular XIAO).
- **Firmware:** add `ws2812`/`zmk,underglow` + the `ext-power` node (mirror WalkThePlanck).
- **Routing note:** this is the part that made it painful — RGB power/data must thread the necks with
  the matrix rows. A *4-layer thin* board (inner layers relieved across the necks) would ease it without
  losing the bend; that's the natural enabler for this variant.

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
      tolerance. Diode tucks beside each switch on its strip. Produces the outline + footprint
      placement, *not* a routed board.
- [ ] **Footprints (prereq for the PCB).** Inventory of `../ergogen-footprints`:
      `diode_smd_sod323f` ✅, `switch_pg1316s` ✅, regular-XIAO helpers ✅ (`xiao_ble_breakout_holes`,
      `util_xiao_ble_cutout[_simple]`). Confirm the regular-XIAO helpers give a full solder-down
      footprint. Local `footprints/` still carries the stale `mcu_nice_nano_smd.js` — remove once the
      XIAO footprint is mirrored in. (No LED/MOSFET footprints needed — RGB shelved.)
- [ ] **PCB layout + routing (KiCad) — the core build job.** From the comb layout: place
      switch + diode per key on each column strip, then route the 5×4 matrix (column lines up each
      strip, ~4 row lines across the necks; 2 layers is plenty now), and the XIAO breakout +
      power/reset/battery on the root. **Both halves on one `.kicad_pcb`** (two closed Edge.Cuts
      outlines, `L_`/`R_` nets) per workspace convention. DRC clean before panelizing.
- [ ] **Schematic build/sync.** ergogen emits no schematic — build per `Schematics_and_Ergogen.md`
      (match refs/pins/nets to the ergogen PCB, then KiCad *Update Schematic from PCB*). Needs symbols
      for the XIAO BLE (add to `huntercook.kicad_sym` / `${HLC_SYMBOLS}` if missing).
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
- [ ] **JLC BOM audit + order.** Confirm all parts JLC-stocked + SMD (prefer Basic): XIAO `C17209540`,
      1N4148WT SOD-323 diodes, EZmate `C505023`, power `C2911519`, reset `C79174`; PG1316S consigned
      `C9900170245`. Keys only — no LED/MOSFET parts (RGB shelved). Standard JLC turnkey order
      (gerbers + CPL + BOM); stackup per Production (2-layer 0.6 mm ENIG).
- [x] Name: **stactyl** (stacks + dactyl). 2026-06-18.
- [x] **git:** both repos created + pushed 2026-06-18 — `jusdisgi/stactyl` (incl. the locked
      Cosmos geometry + design docs) and `jusdisgi/zmk-config-stactyl` (firmware skeleton). Ongoing
      work = normal commits. Per workspace policy, **never run git** — Hunter runs them.
