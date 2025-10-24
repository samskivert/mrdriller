import { Drill, section, measure, beat, labeledBeat, R, r, rd, ru, L, l, ld, lu } from "./model"

const su = undefined

export const kodoParadiddle: Drill = {
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
  title: "Bachi Hakobi (桴運び)",
  bpm: 4,
  rows: [
    [
      section(
        "Three",
        1,
        [
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
        ],
        [
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
        ],
      ),
    ],

    [
      section(
        "Four",
        1,
        [
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
        ],
        [
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
        ],
      ),
    ],

    [
      section(
        "One",
        1,
        [
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
        ],
        [
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
        ],
      ),
    ],

    [
      section(
        "Two",
        1,
        [
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
        ],
        [
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
        ],
      ),
    ],
  ],
}

export const oneEAndA: Drill = {
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
  title: "Ice Skater",
  bpm: 8,
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
  title: "Three against Two",
  bpm: 6,
  rows: [
    [section("A", 4, [beat(r, l), su, beat(r), beat(su, l), beat(r), su]),
     section("B", 4, [beat(r), beat(su, l), beat(r), su, beat(r, l), su]),
     section("C", 4, [beat(r, l), su, beat(su, l), beat(r), beat(su, l), su]),
     section("D", 4, [beat(su, l), beat(r), beat(su, l), su, beat(r, l), su]),
     ]
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
]
