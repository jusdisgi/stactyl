// stactyl — Cosmos Expert-mode config (per-key transforms).
// Source of truth for the keywell geometry. Captured from the Cosmos
// configurator 2026-06-18 (Hunter's session); edited 2026-06-18 (pinky -> 1u,
// finger spacing -> 18x17). This is the bridge data informing the ergogen
// per-column comb staggers (BastardKB-style comb, not a developed grid; the
// serpentine necks absorb the curvature when bent — no arc-length unfold).
//
// Key parameters (see ./keywell-params.md):
//   - keyBasis: "choc"  (PG1316S proxy; switches retained by the printed plate)
//   - curvatureOfColumn: 15deg, curvatureOfRow: 5deg   (DM-Mini target)
//   - tenting: 18deg (rightFingersPlane Y-rotation)
//   - spacingOfColumns: 18mm, spacingOfRows: 17mm  (standard Choc pitch; set
//        2026-06-18, was 21.5/20.5 default). Thumb cluster keeps its own 20mm.
//   - 18 keys/hand: 5 finger columns (-1.5..2.5) + 1 outboard pinky (col +/-2.75,
//        1u, rotated 90deg) + 2 thumbs. (Pinky was aspect 1.5; set to 1u
//        2026-06-18 — custom rounded/tri caps + case clearance done later in CAD.)
//   - shell: tilt 7.2; wrist rests defined (likely drop for a portable board).
//   - microcontroller: null, connectors: [] (set 2026-06-18). Cosmos's auto MCU
//        holder didn't fit the tighter 18x17 shell; we place the controller
//        (XIAO nRF52840 Plus as of the 2026-06-22 reorientation) + LiPo in custom
//        pockets under the keywell in CAD anyway (per the brief). NB: connectors
//        must be [] not null — Cosmos reads .length on it and crashes on null.
//        Re-enable the holder only if you want it back.
//
// NOTE: a 0.5 column index in Cosmos = the matrix is centered between columns;
// left/right use mirrored signs. The pinky column carries an extra translate
// (0,-13,6); the index column an extra translate (0,2.8,-4).

const options: Options = {
  wallThickness: 4,
  wallShrouding: 0,
  wallXYOffset: 5,
  wallZOffset: 15,
  webThickness: 0,
  webMinThicknessFactor: 0.8,
  verticalClearance: 0.1,
  plateThickness: 3,
  keyBasis: "choc",
  screwIndices: [-1, -1, -1, -1, -1, -1, -1],
  screwCountersink: true,
  screwSize: "M3",
  screwType: "screw insert",
  clearScrews: true,
  rounded: {},
  connectors: [],
  connectorIndex: -1,
  microcontroller: null,
  microcontrollerAngle: 0,
  fastenMicrocontroller: true,
  flipConnectors: false,
  wristRestLeft: {
    angle: 0,
    taper: 10,
    tenting: 6,
    slope: 5,
    maxWidth: 100,
    extension: 8
  },
  wristRestRight: {
    angle: 0,
    taper: 10,
    tenting: 6,
    slope: 5,
    maxWidth: 100,
    extension: 8
  },
  wristRestOrigin: new Trsf().translate(10, -110, 0),
  shell: {
    type: "tilt",
    tilt: 7.2,
    raiseBy: 3,
    pattern: [10, 5]
  }
}
// NOTE: Screws / the connector with
// negative indices are placed automatically.
// In the basic/advanced tab, these values were:
// [left] screwIndices: [2.5, 11.5, 29.5, 16.5, 7.5, 33.5, 26.5]
// [left] connectorIndex: 22.4
// [right] screwIndices: [2.5, 11.5, 29.5, 16.5, 7.5, 33.5, 26.5]
// [right] connectorIndex: 22.4

/**
 * The planes used to position the clusters.
 * It's rotated by the tenting and x rotation
 */
const rightFingersPlane = new Trsf()
  .rotate(1.0444444444444445, [0, 0, 0], [1, 0, 0], false)
  .rotate(18, [0, 0, 0], [0, 1, 0], false)
  .rotate(0.3333333333333333, [0, 0, 0], [0, 0, 1], false)
  .translate(-3, 56.6, -15.2)

const rightThumbsPlane = new Trsf()
  .rotate(-11.88888888888889, [0, 0, 0], [1, 0, 0])
  .rotate(-24.8, [0, 0, 0], [0, 1, 0])
  .rotate(34.44444444444444, [0, 0, 0], [0, 0, 1])
  .translate(-35.8, -25.6, -7.1)
  .transformBy(new Trsf()
    .translate(3, -56.6, 15.2)
    .rotate(-0.3333333333333333, [0, 0, 0], [0, 0, 1])
    .rotate(-18, [0, 0, 0], [0, 1, 0])
    .rotate(-1.0444444444444445, [0, 0, 0], [1, 0, 0])
  )
  .transformBy(new Trsf()
    .rotate(1.0444444444444445, [0, 0, 0], [1, 0, 0], false)
    .rotate(18, [0, 0, 0], [0, 1, 0], false)
    .rotate(0.3333333333333333, [0, 0, 0], [0, 0, 1], false)
    .translate(-3, 56.6, -15.2)
  )

const leftFingersPlane = new Trsf()
  .rotate(1.0444444444444445, [0, 0, 0], [1, 0, 0], false)
  .rotate(-18, [0, 0, 0], [0, 1, 0], false)
  .rotate(-0.3333333333333333, [0, 0, 0], [0, 0, 1], false)
  .translate(3, 56.6, -15.2)

const leftThumbsPlane = new Trsf()
  .rotate(-11.88888888888889, [0, 0, 0], [1, 0, 0])
  .rotate(24.8, [0, 0, 0], [0, 1, 0])
  .rotate(-34.44444444444444, [0, 0, 0], [0, 0, 1])
  .translate(35.8, -25.6, -7.1)
  .transformBy(new Trsf()
    .translate(-3, -56.6, 15.2)
    .rotate(0.3333333333333333, [0, 0, 0], [0, 0, 1])
    .rotate(18, [0, 0, 0], [0, 1, 0])
    .rotate(-1.0444444444444445, [0, 0, 0], [1, 0, 0])
  )
  .transformBy(new Trsf()
    .rotate(1.0444444444444445, [0, 0, 0], [1, 0, 0], false)
    .rotate(-18, [0, 0, 0], [0, 1, 0], false)
    .rotate(-0.3333333333333333, [0, 0, 0], [0, 0, 1], false)
    .translate(3, 56.6, -15.2)
  )


/** Definitions for all keys. */
const fingersLeft: Key[] = [
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -1,
        spacingOfRows: 17,
        curvatureOfColumn: 15,
        arc: 0,
        columnForArc: -1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: -1.5,
        spacingOfColumns: 18,
        curvatureOfRow: 5
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "q",
      row: 2,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 0,
        spacingOfRows: 17,
        curvatureOfColumn: 15,
        arc: 0,
        columnForArc: -1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: -1.5,
        spacingOfColumns: 18,
        curvatureOfRow: 5
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "a",
      home: "pinky",
      row: 3,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 1,
        spacingOfRows: 17,
        curvatureOfColumn: 15,
        arc: 0,
        columnForArc: -1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: -1.5,
        spacingOfColumns: 18,
        curvatureOfRow: 5
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "z",
      row: 4,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -0.5,
        row: -1,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "w",
      row: 2,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -0.5,
        row: 0,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "s",
      home: "ring",
      row: 3,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -0.5,
        row: 1,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "x",
      row: 4,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -1,
        spacingOfRows: 17,
        curvatureOfColumn: 15,
        arc: 0,
        columnForArc: 0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: 0.5,
        spacingOfColumns: 18,
        curvatureOfRow: 5
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "e",
      row: 2,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 0,
        spacingOfRows: 17,
        curvatureOfColumn: 15,
        arc: 0,
        columnForArc: 0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: 0.5,
        spacingOfColumns: 18,
        curvatureOfRow: 5
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "d",
      home: "middle",
      row: 3,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 1,
        spacingOfRows: 17,
        curvatureOfColumn: 15,
        arc: 0,
        columnForArc: 0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: 0.5,
        spacingOfColumns: 18,
        curvatureOfRow: 5
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "c",
      row: 4,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 1.5,
        row: -1,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "r",
      row: 2,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 1.5,
        row: 0,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "f",
      home: "index",
      row: 3,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 1.5,
        row: 1,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "v",
      row: 4,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 2.5,
        row: -1,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "t",
      row: 2,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 2.5,
        row: 0,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "g",
      row: 3,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 2.5,
        row: 1,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    keycap: {
      letter: "b",
      row: 4,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .rotate(0, [0, 0, 0], [1, 0, 0])
      .rotate(0, [0, 0, 0], [0, 1, 0])
      .rotate(-90, [0, 0, 0], [0, 0, 1])
      .translate(0, -19.7, 6)
      .placeOnMatrix({
        column: -2.75,
        row: 0,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(leftFingersPlane),
    keycap: { row: 3, profile: "choc" }
  }
]

const thumbsLeft: Key[] = [
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(17.08888888888889, [0, 0, 0], [1, 0, 0])
      .rotate(20.355555555555554, [0, 0, 0], [0, 1, 0])
      .rotate(10.466666666666667, [0, 0, 0], [0, 0, 1])
      .translate(21.8, 30.1, 17.3)
      .placeOnMatrix({
        column: -0.4,
        row: -0.34,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 0,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(leftThumbsPlane),
    keycap: {
      home: "thumb",
      row: 5,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(16.266666666666666, [0, 0, 0], [1, 0, 0])
      .rotate(-14.822222222222223, [0, 0, 0], [0, 1, 0])
      .rotate(17.42222222222222, [0, 0, 0], [0, 0, 1])
      .translate(20.9, 33, 17.1)
      .placeOnMatrix({
        column: -1.43,
        row: -0.06,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 0,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(leftThumbsPlane),
    keycap: { row: 5, profile: "choc" }
  }
]

const fingersRight: Key[] = [
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -1,
        spacingOfRows: 17,
        curvatureOfColumn: 15,
        arc: 0,
        columnForArc: 1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: 1.5,
        spacingOfColumns: 18,
        curvatureOfRow: 5
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: "p",
      row: 2,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 0,
        spacingOfRows: 17,
        curvatureOfColumn: 15,
        arc: 0,
        columnForArc: 1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: 1.5,
        spacingOfColumns: 18,
        curvatureOfRow: 5
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: ";",
      home: "pinky",
      row: 3,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 1,
        spacingOfRows: 17,
        curvatureOfColumn: 15,
        arc: 0,
        columnForArc: 1.5
      })
      .transformBy(new Trsf().translate(0, -13, 6)
      )
      .placeColumn({
        column: 1.5,
        spacingOfColumns: 18,
        curvatureOfRow: 5
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: "/",
      row: 4,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 0.5,
        row: -1,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: "o",
      row: 2,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 0.5,
        row: 0,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: "l",
      home: "ring",
      row: 3,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: 0.5,
        row: 1,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: ".",
      row: 4,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: -1,
        spacingOfRows: 17,
        curvatureOfColumn: 15,
        arc: 0,
        columnForArc: -0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: -0.5,
        spacingOfColumns: 18,
        curvatureOfRow: 5
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: "i",
      row: 2,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 0,
        spacingOfRows: 17,
        curvatureOfColumn: 15,
        arc: 0,
        columnForArc: -0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: -0.5,
        spacingOfColumns: 18,
        curvatureOfRow: 5
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: "k",
      home: "middle",
      row: 3,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeRow({
        row: 1,
        spacingOfRows: 17,
        curvatureOfColumn: 15,
        arc: 0,
        columnForArc: -0.5
      })
      .transformBy(new Trsf().translate(0, 2.8, -4)
      )
      .placeColumn({
        column: -0.5,
        spacingOfColumns: 18,
        curvatureOfRow: 5
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: ",",
      row: 4,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -1.5,
        row: -1,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: "u",
      row: 2,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -1.5,
        row: 0,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: "j",
      home: "index",
      row: 3,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -1.5,
        row: 1,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: "m",
      row: 4,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -2.5,
        row: -1,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: "y",
      row: 2,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -2.5,
        row: 0,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: "h",
      row: 3,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .placeOnMatrix({
        column: -2.5,
        row: 1,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    keycap: {
      letter: "n",
      row: 4,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "fingers",
    position: new Trsf()
      .rotate(0, [0, 0, 0], [1, 0, 0])
      .rotate(0, [0, 0, 0], [0, 1, 0])
      .rotate(90, [0, 0, 0], [0, 0, 1])
      .translate(0, -19.7, 6)
      .placeOnMatrix({
        column: 2.75,
        row: 0,
        spacingOfColumns: 18,
        spacingOfRows: 17,
        curvatureOfRow: 5,
        curvatureOfColumn: 15,
        arc: 0
      })
      .transformBy(rightFingersPlane),
    keycap: { row: 3, profile: "choc" }
  }
]

const thumbsRight: Key[] = [
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(17.08888888888889, [0, 0, 0], [1, 0, 0])
      .rotate(-20.355555555555554, [0, 0, 0], [0, 1, 0])
      .rotate(-10.466666666666667, [0, 0, 0], [0, 0, 1])
      .translate(-21.8, 30.1, 17.3)
      .placeOnMatrix({
        column: 0.4,
        row: -0.34,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 0,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(rightThumbsPlane),
    keycap: {
      home: "thumb",
      row: 5,
      profile: "choc"
    }
  },
  {
    type: "choc-v1",
    aspect: 1,
    cluster: "thumbs",
    position: new Trsf()
      .rotate(16.266666666666666, [0, 0, 0], [1, 0, 0])
      .rotate(14.822222222222223, [0, 0, 0], [0, 1, 0])
      .rotate(-17.42222222222222, [0, 0, 0], [0, 0, 1])
      .translate(-20.9, 33, 17.1)
      .placeOnMatrix({
        column: 1.43,
        row: -0.06,
        spacingOfColumns: 20,
        spacingOfRows: 20,
        curvatureOfRow: 0,
        curvatureOfColumn: 0,
        arc: 0
      })
      .transformBy(rightThumbsPlane),
    keycap: { row: 5, profile: "choc" }
  }
]

export default {
  left: {
    ...options,
    keys: [...fingersLeft, ...thumbsLeft],
  },
  right: {
    ...options,
    keys: [...fingersRight, ...thumbsRight],
  },
}
