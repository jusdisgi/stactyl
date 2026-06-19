# CLAUDE.md — stactyl  *(name = "stacks" + "dactyl"; it stacks to stow)*

Notes for future sessions. Workspace-wide conventions live in `../CLAUDE.md`; this file holds only
what's specific to **stactyl**. Keep it thin. This is a **design brief / kickoff** — nothing is built
yet. Decisions below were settled with Hunter on 2026-06-18; open items are marked TODO.

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
  trivially — but **direct-pin** like xiphos, not a matrix like tbkmini; see Controller & wiring.)

## Switches & controller

- **Kailh PG1316S** ultra-low-profile, **consigned at JLCPCB** (`C9900170245`, Hunter's reel).
- Switch retention is by the **printed keywell plate**, not the PCB (see PCB approach) — the low
  PG1316S stack lets the keywell scoop stay shallow, which is what makes the thin-FR-4 plate viable.
- **Controller: nice!nano (nRF52840), one per half, hand-soldered** (castellated = easy, wide pitch).
  **left = split central** (workspace convention). LiPo per half. TODO: controller + cell pocket
  placement under the keywell. **NB:** the MCU is placed by *us* in custom CAD, **not** by the
  keywell generator — Cosmos's auto MCU holder + connector are deliberately disabled in the Expert
  config (didn't fit the tight shell, wrong for a central hand-soldered board, and adds stow bulk).
  The case exposes the nice!nano's **own USB-C port** for charge/flash — no separate connector.
- **Wiring: direct-pin — NO diodes, NO matrix.** The `../xiphos` recipe (cradio-derived direct-pin
  shield). 18 keys/half = 18 GPIO, which the nice!nano provides. Drops the diode BOM *and* the
  diode-direction risk that bit the tbkmini build.
- No RGB, no encoder, no trackball (matches Hunter's tbkmini build).

### Why nice!nano and not XIAO (evaluated 2026-06-18, decided against *for now*)

- **XIAO nRF52840 Plus** (20 GPIO — could also do direct-pin): its extra 9 GPIO sit on hidden
  back-side pads needing **reflow** (not iron-friendly), and JLC will only **consign** it
  (`C9900053998` — you buy + ship your own). Rejected: soldering pain + unwanted consignment. On the 
  watch list; if JLC stocked it this would be the perfect part.
- **Base XIAO nRF52840** (11 GPIO): JLC **will source & place** it (`C37327670`, mfr Seeed, ~$8.97) —
  turnkey, zero hand-solder — BUT 11 GPIO ⇒ **forces a matrix + diodes**, and it's currently
  **out of stock with a 444-unit pre-order MOQ** (~$4k), so not orderable in 2s today. On the watch list.
- **Possible future variant:** if `C37327670` returns to low-qty stock, a **fully-JLC-assembled**
  cost-down variant = base XIAO + **5×4 matrix + SOD-323 diodes** (`diode_smd_sod323f`). Same plate
  geometry, different controller footprint + diodes added. Trades diode-free for zero hand-solder.
- **Possible future variant:** using XIAO Plus with xiphos-pattern direct wiring. Either for assembly
  via Seeed Fusion (pending switch availability) or JLC (pending MCU availability). This would be
  superior in every way, if only the parts could be sourced at the same fab house.

## PCB approach — THE key decision (settled)

**Thin rigid FR-4 "flex-by-thinness" plate. NOT a polyimide flex circuit, NOT rigid-flex.**

This is exactly how BastardKB's own TBK Mini plate works: it's called a "flexible PCB" but is ordered
as **standard FR-4 at 0.6 mm (or 0.8 mm) thickness** — i.e. the normal rigid PCB/PCBA pipeline, just
thin. "Flexible" = *thin enough to bend into place by hand*, not a flex material. (Polyimide flex is
spec'd by copper/coverlay in the 0.1–0.2 mm range through a different product line; the mm-thickness
order instruction is the tell.)

How it works mechanically:
- Board is drawn **one-switch-per-facet** with **thin FR-4 necks** between facets.
- **PCBA it flat** (PG1316S reflowed onto solid FR-4 — clean, well-supported, standard process).
- **Flex it into the printed keywell** on assembly: each facet hinges at its necks to that key's
  angle; switches click into the plate pockets; screws hold it formed. It bends **once**, then the
  case carries it.

Why this is the chosen path: stays **100% inside Hunter's existing rigid-FR-4 flow** — consigned
PG1316S reel, hot-plate/JLC reflow, **KiKit** panelization — with **no rigid-flex premium** and **no
"can I consign parts on a flex order?" risk**. Satisfies *ease-of-production* and *consigned-PCBA*
goals while effectively delivering the "flexible PCB" intent. The earlier rigid-flex / flex-jumper
analysis is moot — none of it is needed.

Caveats / design tasks:
- **The necks are the fragile bit.** Thin FR-4 cracks copper if a neck over-bends. We control the
  keywell (generating fresh, shallow for PG1316S), so keep every neck inside FR-4 bend tolerance by
  design. TODO: validate bend angle per neck against the chosen scoop before ordering.
- **Neck/facet layout is the one genuinely new design problem** — orient each neck to hinge in the
  right direction for the compound curve. It's a board-layout problem, not a fab-process problem.
- **Direct-pin routing:** with no diodes/matrix, each key needs its own trace back to the MCU, so the
  necks nearest the controller carry up to ~18 converging traces (a matrix shares fewer lines along
  the facet grid). Validate in layout — central MCU + both copper layers. (The future XIAO-matrix
  variant would route easier through the necks, at the cost of diodes.)
- Fallback with **zero redesign**: the identical layout can be re-ordered as true polyimide flex if
  durability ever demands it. Start thin-FR-4.

## Case / keywell geometry

- **Generate a fresh low-profile Dactyl** dialed for PG1316S height + spacing, using **TBK Mini
  column angles as the target** (not a precise match — Hunter likes the TBK feel but exact match
  is *not* required, confirmed 2026-06-18; PG1316S ergonomics win where they conflict).
- **Generator: Cosmos** (`ryanis.cool/cosmos`), decided 2026-06-18. Chosen over Dactyl-Manuform /
  Dometyl because stactyl's two downstream needs are what differ: (1) the **stow CAD** (nest
  hulls + magnet-pad booleans) needs clean **STEP** — Cosmos exports stable multi-part STEP into
  Fusion/OnShape; the OpenSCAD generators emit meshes that are painful for boolean work; (2) the
  **flat-plate facet layout** needs **per-key transforms**, which Cosmos **Expert mode** exposes
  as editable JS — exactly the bridge to the ergogen developed/arc-length plate. Plus native
  low-profile support and no opam/Clojure toolchain. Caveat: Cosmos has no PG1316S — use **Choc V1**
  as the Z-height/socket proxy (retention is the printed plate anyway).
- **Starting parameter set captured in `cad/keywell-params.md`** (DM-Mini lineage: column curve
  15° / row curve 5° / tent ~18°, center col = ring, PG1316S 17×17 spacing). It's a starting
  point to dial against the physical TBK, not a clone.
- **Toolchain note:** **ergogen is 2D and cannot model a keywell** — this breaks from every other
  board in gittyup. The keywell case comes from a dactyl generator / CAD, *not* ergogen. ergogen can
  still lay out the **flat plate PCB pattern** (with developed / arc-length facet spacing so it lands
  on the posts when bent), but the 3D shell is a separate CAD job.

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

- **`../ergogen-footprints`**: `switch_pg1316s`, `power_switch_smd_side`,
  `reset_switch_smd_side`, `magsafe_silkscreen`, `mounting_hole_npth` (and `diode_smd_sod323f` **only**
  if the future XIAO-matrix variant is built — the primary direct-pin design has no diodes).
  **`mcu_nice_nano_smd` check this one but likely will use the normal ceoloide footprint instead of
  this custom one I built for slotted applications.
- **`../slimsplaydy` + `../xiphos` PCBA flow**: consigned-reel BOM/CPL, JLC order config, KiKit
  multiboard panelization, the embedded-magnet + registration clasp pattern (adapt to 3D pads here).
- **Firmware base:** start from **`../zmk-config-xiphos`** (cradio-derived **direct-pin** shield,
  18/hand) — the right match since stactyl is direct-pin. `../zmk-config-tbkmini` is a *matrix* shield
  (wrong wiring) but maybe useful if we do a XIAO matrix variant. Reuse sweep-pro keymap lineage either way.
- **BastardKB TBK Mini** (geometry + plate PCB) as a **reference only**. License is **CC BY-NC-SA
  4.0** — *prefer generating fresh (clean-room) over copying their files* so stactyl isn't encumbered
  by NC/SA; the column geometry is a *target*, not a copied asset. Non-commercial anyway = fine for
  Hunter's personal use; just don't sell derivatives of their files.

## Production (JLCPCB PCBA)

Same model as slimsplaydy/xiphos: fab + assembly at JLCPCB; **PG1316S consigned `C9900170245`**;
catalog parts Molex Pico-EZmate `C505023`, power switch `C2911519`, reset switch `C79174`;
**nice!nano = DNP / hand-soldered** (castellated). Panelize with **KiKit** (on Hunter's machine) after routing.
Order the plate at **0.6 mm FR-4** (0.8 mm fallback if 0.6 mm bends too hard for the scoop).

## Open items / TODO

- [x] Pick dactyl generator + capture the PG1316S parameter set (match TBK Mini columns).
      **Cosmos**; starting params in `cad/keywell-params.md`. 2026-06-18.
- [x] Build the Cosmos model + capture Expert per-key transforms. 2026-06-18. Geometry **locked**:
      `cad/stactyl-cosmos-expert.ts` is the source of truth (18×17 Choc spacing, tenting 18°,
      curve 5/15, 18 keys/hand, 1u outboard pinky). **STEP/STL export still pending** (Cosmos →
      Download → save to `cad/`). Scoop-depth-vs-neck-bend validation still open (below).
- [ ] Design facet/neck pattern for the thin-FR-4 plate; validate per-neck bend angle. Next big
      task: translate the Expert per-key transforms into ergogen developed/arc-length plate spacing.
- [x] Finalize 2-key thumb cluster + outboard pinky positions. 2026-06-18. Curved 2-key thumb;
      outboard pinky = 1u (custom rounded/tri caps + case clearance to be done in CAD).
- [x] Controller + wiring: **nice!nano, direct-pin, no diodes** (xiphos recipe). 2026-06-18. Base XIAO
      `C37327670` + matrix noted as a future cost-down / turnkey variant (gated on JLC stock).
- [ ] **Controller + LiPo + USB pocket (custom CAD, decoupled from Cosmos).** Cosmos's auto MCU
      holder + connector are nulled in the Expert config (didn't fit the tight shell + wrong for our
      central hand-soldered nice!nano + stow-volume goal). So on the exported STEP we model: a
      nice!nano pocket, a LiPo pocket, and a USB-C cutout aligned to the nice!nano's onboard port
      (the board charges/flashes through that port — no separate connector).
- [ ] Stowed-pose CAD assembly → matched magnet pads + registration; settle rotation/offset.
- [x] Firmware: `zmk-config-stactyl` built 2026-06-18 — cloned from `zmk-config-xiphos` (direct-pin,
      not the tbkmini matrix), 18/hand, 36-key transform. **Pins are PLACEHOLDER** (inherited from
      xiphos) until the PCB is routed. Re-derive from the MCU footprint then.
- [x] Name: **stactyl** (stacks + dactyl). 2026-06-18.
- [ ] **git:** initial skeleton committed + pushed to `jusdisgi/stactyl` 2026-06-18. **New
      uncommitted work since:** `cad/stactyl-cosmos-expert.ts`, updated `cad/keywell-params.md`,
      and CLAUDE.md edits — needs a commit. `zmk-config-stactyl` repo: commands handed over, confirm
      it was pushed. Per workspace policy, **never run git** — Hunter runs them.
