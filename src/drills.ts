import { Drill, section, measure, beat, labeledBeat, R, r, rd, ru, L, l, ld, lu } from "./model"

const su = undefined

export const kodoParadiddle: Drill = {
  id: "kodo-paradiddle",
  title: "Paradiddle Drill",
  bpm: 4,
  rows: [
    [section("Accent on 1", 4, measure(R, l, r, r), measure(L, r, l, l))],
    [section("Accent on 3+4", 4, measure(r, l, R, R), measure(l, r, L, L))],
    [
      section("Accent on R", 2, measure(R, l, R, R), measure(l, R, l, l)),
      section("Accent on L", 2, measure(r, L, r, r), measure(L, r, L, L)),
    ],
    [
      section("Accent on R", 2, measure(R, l, R, R), measure(l, R, l, l)),
      section("Accent on L", 2, measure(r, L, r, r), measure(L, r, L, L)),
    ],
    [section("Accent on 4", 4, measure(r, l, r, R), measure(l, r, l, L))],
  ],
}

export const paradiddleInversions: Drill = {
  id: "paradiddle-inversions",
  title: "Paradiddle Inversions",
  bpm: 4,
  rows: [
    [section("Pa-ra-did-dle", 4, measure(R, l, r, r), measure(L, r, l, l))],
    [section("Ra-did-dle-pa", 4, measure(R, l, l, r), measure(L, r, r, l))],
    [section("Did-dle-pa-ra", 4, measure(R, r, l, r), measure(L, l, r, l))],
    [section("Dle-pa-ra-did", 4, measure(R, l, r, l), measure(L, r, l, r))],
  ],
}

export const bachiHakobi: Drill = {
  id: "bachi-hakobi",
  title: "Bachi Hakobi - 桴運び",
  bpm: 4,
  beeps: [1, 3],
  rows: [
    [
      section("Three - R", 1, [
        labeledBeat("1", rd),
        beat(ru),
        su,
        su,
        labeledBeat("2", ld),
        beat(lu),
        su,
        su,
        labeledBeat("3", rd),
        labeledBeat("+", ru, ld),
        su,
        su,
        labeledBeat("4", rd),
        beat(ru, lu),
        su,
        su,
      ]),
      section("Three - L", 1, [
        labeledBeat("1", ld),
        beat(lu),
        su,
        su,
        labeledBeat("2", rd),
        beat(ru),
        su,
        su,
        labeledBeat("3", ld),
        labeledBeat("+", lu, rd),
        su,
        su,
        labeledBeat("4", ld),
        beat(lu, ru),
        su,
        su,
      ]),
    ],

    [
      section("Four - R", 1, [
        labeledBeat("1", rd),
        beat(ru),
        su,
        su,
        labeledBeat("2", ld),
        beat(lu),
        su,
        su,
        labeledBeat("3", rd),
        beat(ru),
        su,
        su,
        labeledBeat("4", ld),
        labeledBeat("+", lu, rd),
        su,
        su,
      ]),
      section("Four - L", 1, [
        labeledBeat("1", ld),
        beat(lu, ru),
        su,
        su,
        labeledBeat("2", rd),
        beat(ru),
        su,
        su,
        labeledBeat("3", ld),
        beat(lu),
        su,
        su,
        labeledBeat("4", rd),
        labeledBeat("+", ru, ld),
        su,
        su,
      ]),
    ],

    [
      section("One - R", 1, [
        labeledBeat("1", rd),
        labeledBeat("+", ru, ld),
        su,
        su,
        labeledBeat("2", rd),
        beat(ru, lu),
        su,
        su,
        labeledBeat("3", ld),
        beat(lu),
        su,
        su,
        labeledBeat("4", rd),
        beat(ru),
        su,
        su,
      ]),
      section("One - L", 1, [
        labeledBeat("1", ld),
        labeledBeat("+", lu, rd),
        su,
        su,
        labeledBeat("2", ld),
        beat(lu, ru),
        su,
        su,
        labeledBeat("3", rd),
        beat(ru),
        su,
        su,
        labeledBeat("4", ld),
        beat(lu),
        su,
        su,
      ]),
    ],

    [
      section("Two - R", 1, [
        labeledBeat("1", rd),
        beat(ru),
        su,
        su,
        labeledBeat("2", ld),
        labeledBeat("+", lu, rd),
        su,
        su,
        labeledBeat("3", ld),
        beat(lu, ru),
        su,
        su,
        labeledBeat("4", rd),
        beat(ru),
        su,
        su,
      ]),
      section("Two - L", 1, [
        labeledBeat("1", ld),
        beat(lu),
        su,
        su,
        labeledBeat("2", rd),
        labeledBeat("+", ru, ld),
        su,
        su,
        labeledBeat("3", rd),
        beat(ru, lu),
        su,
        su,
        labeledBeat("4", ld),
        beat(lu),
        su,
        su,
      ]),
    ],
  ],
}

export const oneEAndA: Drill = {
  id: "one-e-and-a",
  title: "One e and a (1e+a)",
  bpm: 4,
  rows: [
    [section("0", 4, measure(r, l, r, l))],
    [
      section("1A", 4, measure(R, l, r, l)),
      section("1B", 4, measure(r, L, r, l)),
      section("1C", 4, measure(r, l, R, l)),
      section("1D", 4, measure(r, l, r, L)),
    ],
    [
      section("2A", 4, measure(R, L, r, l)),
      section("2B", 4, measure(r, L, R, l)),
      section("2C", 4, measure(r, l, R, L)),
      section("2D", 4, measure(R, l, r, L)),
      section("2E", 4, measure(R, l, R, l)),
      section("2F", 4, measure(r, L, r, L)),
    ],
    [
      section("3A", 4, measure(R, L, R, l)),
      section("3B", 4, measure(r, L, R, L)),
      section("3C", 4, measure(R, l, R, L)),
      section("3D", 4, measure(R, L, r, L)),
    ],
    [section("4", 4, measure(R, L, R, L))],
  ],
}

export const iceSkater: Drill = {
  id: "ice-skater",
  title: "Ice Skater",
  bpm: 8,
  beeps: [1, 3, 5, 7],
  scale: 0.5,
  rows: [
    [
      section("Four", 2, measure(r, su, r, su, r, su, r, su, l, su, l, su, l, su, l, su)),
      section("Three", 2, measure(r, su, r, su, r, su, l, su, l, su, l, su)),
      section("Four", 1, measure(r, su, r, su, r, su, r, su)),
    ],
    [
      section("Four", 2, measure(l, su, l, su, l, su, l, su, r, su, r, su, r, su, r, su)),
      section("Three", 2, measure(l, su, l, su, l, su, r, su, r, su, r, su)),
      section("Four", 1, measure(l, su, l, su, l, su, l, su)),
    ],
    [
      section("Four + 1", 2, measure(r, l, r, su, r, su, r, su, l, r, l, su, l, su, l, su)),
      section("Three + 1", 2, measure(r, l, r, su, r, su, l, r, l, su, l, su)),
      section("Four + 1", 1, measure(r, l, r, su, r, su, r, su)),
    ],
    [
      section("Four + 1", 2, measure(l, r, l, su, l, su, l, su, r, l, r, su, r, su, r, su)),
      section("Three + 1", 2, measure(l, r, l, su, l, su, r, l, r, su, r, su)),
      section("Four + 1", 1, measure(l, r, l, su, l, su, l, su)),
    ],
    [
      section("Four + 2", 2, measure(r, l, r, l, r, su, r, su, l, r, l, r, l, su, l, su)),
      section("Three + 2", 2, measure(r, l, r, l, r, su, l, r, l, r, l, su)),
      section("Four + 2", 1, measure(r, l, r, l, r, su, r, su)),
    ],
    [
      section("Four + 2", 2, measure(l, r, l, r, l, su, l, su, r, l, r, l, r, su, r, su)),
      section("Three + 2", 2, measure(l, r, l, r, l, su, r, l, r, l, r, su)),
      section("Four + 2", 1, measure(l, r, l, r, l, su, l, su)),
    ],
  ],
}

export const triplets: Drill = {
  id: "triplets",
  title: "Triplets",
  bpm: 3,
  rows: [
    [
      section("1", 4, measure(R, l, r, L, r, l)),
      section("2", 4, measure(r, L, r, l, R, l)),
      section("3", 4, measure(r, l, R, l, r, L)),
    ],
    [
      section("2+3", 4, measure(r, L, R, l, R, L)),
      section("1+3", 4, measure(R, l, R, L, r, L)),
      section("1+2", 4, measure(R, L, r, L, R, l)),
    ],
  ],
}

export const threeAgainstTwo: Drill = {
  id: "three-against-two",
  title: "Three against Two",
  bpm: 6,
  beeps: [1, 3, 5],
  rows: [
    [
      section("A", 8, [beat(r, l), su, beat(r), beat(su, l), beat(r), su]),
      section("B", 8, [beat(r), beat(su, l), beat(r), su, beat(r, l), su]),
    ],
    [
      section("C", 8, [beat(r, l), su, beat(su, l), beat(r), beat(su, l), su]),
      section("D", 8, [beat(su, l), beat(r), beat(su, l), su, beat(r, l), su]),
    ],
  ],
}

const beatRL = beat(r, l)
const beatR = beat(r)
const beatL = beat(su, l)

export const fourAgainstThree: Drill = {
  id: "four-against-three",
  title: "Four against Three",
  bpm: 12,
  beeps: [1, 5, 9],
  scale: 0.5,
  rows: [
    [
      section("A", 8, [beatRL, su, su, beatR, beatL, su, beatR, su, beatL, beatR, su, su]),
      section("B", 8, [beatR, beatL, su, beatR, su, beatL, beatR, su, su, beatRL, su, su]),
    ],
    [
      section("C", 8, [beatRL, su, su, beatL, beatR, su, beatL, su, beatR, beatL, su, su]),
      section("D", 8, [beatL, beatR, su, beatL, su, beatR, beatL, su, su, beatRL, su, su]),
    ],
  ],
}

const right8 = [beatRL, beatR, beatR, beatR, beatR, beatR, beatR, beatR]
const left8 = [beatRL, beatL, beatL, beatL, beatL, beatL, beatL, beatL]
const right4 = [beatRL, beatR, beatR, beatR]
const left4 = [beatRL, beatL, beatL, beatL]
const right2 = [beatRL, beatR]
const left2 = [beatRL, beatL]
const jan3 = [beatRL, beatRL, beatRL, su]

export const dexter: Drill = {
  id: "dexter",
  title: "Dexter",
  bpm: 4,
  rows: [
    [
      section("Right 8s", 2, right8),
      section("Right 4s", 2, [...right4, ...right4]),
      section("Right 2s", 2, [...right2, ...right2, ...right2]),
      section("Jan Jan Jan", 1, jan3),
    ],
    [
      section("Left 8s", 2, left8),
      section("Left 4s", 2, [...left4, ...left4]),
      section("Left 2s", 2, [...left2, ...left2, ...left2]),
      section("Jan Jan Jan", 1, jan3),
    ],
    [
      section("Right 8", 1, right8),
      section("Left 8", 1, left8),
      section("Alt 4s", 2, [...right4, ...left4]),
      section("Alt 2s", 3, [...right2, ...left2]),
      section("Jan Jan Jan", 1, jan3),
    ],
  ],
}

export const drills = [
  oneEAndA,
  kodoParadiddle,
  paradiddleInversions,
  bachiHakobi,
  iceSkater,
  triplets,
  threeAgainstTwo,
  fourAgainstThree,
  dexter,
]
