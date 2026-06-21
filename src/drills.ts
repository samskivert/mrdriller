import { Drill, oneLineSection, section, measure, line, beat, labeledBeat, R, r, rd, ru, L, l, ld, lu } from "./model"

const su = undefined

export const paradiddles: Drill = {
  id: "paradiddles",
  title: "Paradiddles",
  bpm: 4,
 rows: [
    [
      section(
        "Pa-ra-did-dle",
        4,
        line(measure(r, l, r, r), measure(l, r, l, l)),
        line(measure(r, l, r, r), measure(l, r, l, l)),
        line(measure(R, l, r, r), measure(L, r, l, l)),
        line(measure(R, l, r, r), measure(L, r, l, l)),
      ),
    ],
  ],
}

export const kodoParadiddle: Drill = {
  id: "kodo-paradiddle",
  title: "Paradiddle Drill",
  bpm: 4,
  rows: [
    [oneLineSection("Accent 1", 4, measure(R, l, r, r), measure(L, r, l, l))],
    [oneLineSection("Accent 3+4", 4, measure(r, l, R, R), measure(l, r, L, L))],
    [
      oneLineSection("Accent R", 2, measure(R, l, R, R), measure(l, R, l, l)),
      oneLineSection("Accent L", 2, measure(r, L, r, r), measure(L, r, L, L)),
    ],
    [
      oneLineSection("Accent R", 2, measure(R, l, R, R), measure(l, R, l, l)),
      oneLineSection("Accent L", 2, measure(r, L, r, r), measure(L, r, L, L)),
    ],
    [oneLineSection("Accent 4", 4, measure(r, l, r, R), measure(l, r, l, L))],
  ],
}

export const paradiddleAccents: Drill = {
  id: "paradiddle-accents",
  title: "Paradiddle Accents",
  bpm: 4,
  rows: [
    [oneLineSection("PA-ra-did-dle", 4, measure(R, l, r, r), measure(L, r, l, l))],
    [oneLineSection("Pa-RA-did-dle", 4, measure(r, L, r, r), measure(l, R, l, l))],
    [oneLineSection("PA-ra-DID-dle", 4, measure(r, l, R, r), measure(l, r, L, l))],
    [oneLineSection("PA-ra-did-DLE", 4, measure(r, l, r, R), measure(l, r, l, L))],
  ],
}

export const paradiddleInversions: Drill = {
  id: "paradiddle-inversions",
  title: "Paradiddle Inversions",
  bpm: 4,
  rows: [
    [oneLineSection("Pa-ra-did-dle", 4, measure(R, l, r, r), measure(L, r, l, l))],
    [oneLineSection("Ra-did-dle-pa", 4, measure(R, l, l, r), measure(L, r, r, l))],
    [oneLineSection("Did-dle-pa-ra", 4, measure(R, r, l, r), measure(L, l, r, l))],
    [oneLineSection("Dle-pa-ra-did", 4, measure(R, l, r, l), measure(L, r, l, r))],
  ],
}

export const bachiHakobi: Drill = {
  id: "bachi-hakobi",
  title: "Bachi Hakobi - 桴運び",
  bpm: 4,
  beeps: [1, 3],
  rows: [
    [
      oneLineSection("Three - R", 1, [
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
      oneLineSection("Three - L", 1, [
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
      oneLineSection("Four - R", 1, [
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
      oneLineSection("Four - L", 1, [
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
      oneLineSection("One - R", 1, [
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
      oneLineSection("One - L", 1, [
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
      oneLineSection("Two - R", 1, [
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
      oneLineSection("Two - L", 1, [
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
  forceIntro: true,
  rows: [
    [
      oneLineSection("Accent 1", 4, measure(R, l, r, l)),
      oneLineSection("Accent 2", 4, measure(r, L, r, l)),
      oneLineSection("Accent 3", 4, measure(r, l, R, l)),
      oneLineSection("Accent 4", 4, measure(r, l, r, L)),
    ],
    [
      oneLineSection("Accent 1+2", 4, measure(R, L, r, l)),
      oneLineSection("Accent 2+3", 4, measure(r, L, R, l)),
      oneLineSection("Accent 3+4", 4, measure(r, l, R, L)),
      oneLineSection("Accent 1+4", 4, measure(R, l, r, L)),
      oneLineSection("Accent 1+3", 4, measure(R, l, R, l)),
      oneLineSection("Accent 2+4", 4, measure(r, L, r, L)),
    ],
    [
      oneLineSection("Accent 1+2+3", 4, measure(R, L, R, l)),
      oneLineSection("Accent 2+3+4", 4, measure(r, L, R, L)),
      oneLineSection("Accent 1+3+4", 4, measure(R, l, R, L)),
      oneLineSection("Accent 1+2+4", 4, measure(R, L, r, L)),
    ],
    [oneLineSection("Accent 1+2+3+4", 4, measure(R, L, R, L))],
  ],
}

export const diddleAndA: Drill = {
  id: "diddle-and-a",
  title: "Diddle and a",
  bpm: 4,
  forceIntro: true,
  rows: [
    [
      oneLineSection("Accent 1", 2, measure(R, l, r, r), measure(L, r, l, l)),
      oneLineSection("Accent 2", 2, measure(r, L, r, r), measure(l, R, l, l)),
      oneLineSection("Accent 3", 2, measure(r, l, R, r), measure(l, r, L, l)),
      oneLineSection("Accent 4", 2, measure(r, l, r, R), measure(l, r, l, L)),
    ],
    [
      oneLineSection("Accent 1+2", 2, measure(R, L, r, r), measure(L, R, l, l)),
      oneLineSection("Accent 2+3", 2, measure(r, L, R, r), measure(l, R, L, l)),
      oneLineSection("Accent 3+4", 2, measure(r, l, R, R), measure(l, r, L, L)),
      oneLineSection("Accent 1+4", 2, measure(R, l, r, R), measure(L, r, l, L)),
      oneLineSection("Accent 1+3", 2, measure(R, l, R, r), measure(L, r, L, l)),
      oneLineSection("Accent 2+4", 2, measure(r, L, r, R), measure(l, R, l, L)),
    ],
    [
      oneLineSection("Accent 1+2+3", 2, measure(R, L, R, r), measure(L, R, L, l)),
      oneLineSection("Accent 2+3+4", 2, measure(r, L, R, R), measure(l, R, L, L)),
      oneLineSection("Accent 1+3+4", 2, measure(R, l, R, R), measure(L, r, L, L)),
      oneLineSection("Accent 1+2+4", 2, measure(R, L, r, R), measure(L, R, l, L)),
    ],
    [oneLineSection("Accent 1+2+3+4", 2, measure(R, L, R, R), measure(L, R, L, L))],
  ],
}

export const addingAccents: Drill = {
  id: "adding-accents",
  title: "Adding accents",
  bpm: 4,
  forceIntro: true,
  rows: [
    [oneLineSection("None", 1, measure(r, l, r, l), measure(r, l, r, l))],
    [oneLineSection("One", 1, measure(R, l, r, l), measure(R, l, r, l))],
    [oneLineSection("One, Two", 1, measure(R, L, r, l), measure(R, L, r, l))],
    [oneLineSection("One, Two, Three", 1, measure(R, L, R, l), measure(R, L, R, l))],
    [oneLineSection("One, Two, Three, Four", 1, measure(R, L, R, R), measure(R, L, R, R))],
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
      section("Four", 2, line(measure(r, su, r, su, r, su, r, su)), line(measure(l, su, l, su, l, su, l, su))),
    ],
    [
      section("Three", 2, line(measure(r, su, r, su, r, su)), line(measure(l, su, l, su, l, su))),
      oneLineSection("Four", 1, measure(r, su, r, su, r, su, r, su)),
    ],
    [
      section("Four", 2, line(measure(l, su, l, su, l, su, l, su)), line(measure(r, su, r, su, r, su, r, su))),
    ],
    [
      section("Three", 2, line(measure(l, su, l, su, l, su)), line(measure(r, su, r, su, r, su))),
      oneLineSection("Four", 1, measure(l, su, l, su, l, su, l, su)),
    ],
    [
      section(
        "Four + 1",
        2,
        line(measure(r, l, r, su, r, su, r, su)),
        line(measure(l, r, l, su, l, su, l, su)),
      ),
    ],
    [
      section("Three + 1", 2, line(measure(r, l, r, su, r, su)), line(measure(l, r, l, su, l, su))),
      oneLineSection("Four + 1", 1, measure(r, l, r, su, r, su, r, su)),
    ],
    [
      section(
        "Four + 1",
        2,
        line(measure(l, r, l, su, l, su, l, su)),
        line(measure(r, l, r, su, r, su, r, su)),
      ),
    ],
    [
      section("Three + 1", 2, line(measure(l, r, l, su, l, su)), line(measure(r, l, r, su, r, su))),
      oneLineSection("Four + 1", 1, measure(l, r, l, su, l, su, l, su)),
    ],
    [
      section(
        "Four + 2",
        2,
        line(measure(r, l, r, l, r, su, r, su)),
        line(measure(l, r, l, r, l, su, l, su)),
      ),
    ],
    [
      section("Three + 2", 2, line(measure(r, l, r, l, r, su)), line(measure(l, r, l, r, l, su))),
      oneLineSection("Four + 2", 1, measure(r, l, r, l, r, su, r, su)),
    ],
    [
      section(
        "Four + 2",
        2,
        line(measure(l, r, l, r, l, su, l, su)),
        line(measure(r, l, r, l, r, su, r, su)),
      ),
    ],
    [
      section("Three + 2", 2, line(measure(l, r, l, r, l, su)), line(measure(r, l, r, l, r, su))),
      oneLineSection("Four + 2", 1, measure(l, r, l, r, l, su, l, su)),
    ],
  ],
}

export const triplets: Drill = {
  id: "triplets",
  title: "Triplets",
  bpm: 3,
  rows: [
    [
      oneLineSection("Accent 1", 4, measure(R, l, r), measure(L, r, l)),
      oneLineSection("Accent 2", 4, measure(r, L, r), measure(l, R, l)),
      oneLineSection("Accent 3", 4, measure(r, l, R), measure(l, r, L)),
    ],
    [
      oneLineSection("Accent 2+3", 4, measure(r, L, R), measure(l, R, L)),
      oneLineSection("Accent 1+3", 4, measure(R, l, R), measure(L, r, L)),
      oneLineSection("Accent 1+2", 4, measure(R, L, r), measure(L, R, l)),
    ],
  ],
}

const ddkR = measure(r, su, r, l)
const ddkRs = measure(r, su, l, r)
const ddkL = measure(l, su, l, r)
const ddkLs = measure(l, su, r, l)

export const dondoko: Drill = {
  id: "dondoko",
  title: "Dondoko",
  bpm: 4,
  beeps: [1, 3],
  rows: [
    [
      section("8R", 1, line(ddkR, ddkR), line(ddkR, ddkR), line(ddkR, ddkR), line(ddkR, ddkRs)),
      section("8L", 1, line(ddkL, ddkL), line(ddkL, ddkL), line(ddkL, ddkL), line(ddkL, ddkLs)),
    ],
    [section("4s", 2, line(ddkR, ddkR), line(ddkR, ddkRs), line(ddkL, ddkL), line(ddkL, ddkLs))],
    [section("2s", 4, line(ddkR, ddkRs), line(ddkL, ddkLs))],
  ],
}

export const threeAgainstTwo: Drill = {
  id: "three-against-two",
  title: "Three against Two",
  bpm: 6,
  beeps: [1, 3, 5],
  rows: [
    [
      oneLineSection("A", 8, [beat(r, l), su, beat(r), beat(su, l), beat(r), su]),
      oneLineSection("B", 8, [beat(r), beat(su, l), beat(r), su, beat(r, l), su]),
    ],
    [
      oneLineSection("C", 8, [beat(r, l), su, beat(su, l), beat(r), beat(su, l), su]),
      oneLineSection("D", 8, [beat(su, l), beat(r), beat(su, l), su, beat(r, l), su]),
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
      oneLineSection("A", 8, [beatRL, su, su, beatR, beatL, su, beatR, su, beatL, beatR, su, su]),
      oneLineSection("B", 8, [beatR, beatL, su, beatR, su, beatL, beatR, su, su, beatRL, su, su]),
    ],
    [
      oneLineSection("C", 8, [beatRL, su, su, beatL, beatR, su, beatL, su, beatR, beatL, su, su]),
      oneLineSection("D", 8, [beatL, beatR, su, beatL, su, beatR, beatL, su, su, beatRL, su, su]),
    ],
  ],
}

export const allAgainstThree: Drill = {
  id: "all-against-three",
  title: "1, 2, 3, 4 against Three",
  bpm: 12,
  beeps: [1, 5, 9],
  scale: 0.5,
  rows: [
    [
      oneLineSection("1 v 3 - R", 4, [beatRL, su, su, su, beatR, su, su, su, beatR, su, su, su]),
      oneLineSection("2 v 3 - R", 4, [beatRL, su, su, su, beatR, su, beatL, su, beatR, su, su, su]),
    ],
    [
      oneLineSection("3 v 3 - R", 4, [beatRL, su, su, su, beatRL, su, su, su, beatRL, su, su, su]),
      oneLineSection("4 v 3 - R", 4, [beatRL, su, su, beatL, beatR, su, beatL, su, beatR, beatL, su, su]),
    ],
    [
      oneLineSection("1 v 3 - L", 4, [beatRL, su, su, su, beatL, su, su, su, beatL, su, su, su]),
      oneLineSection("2 v 3 - L", 4, [beatRL, su, su, su, beatL, su, beatR, su, beatL, su, su, su]),
    ],
    [
      oneLineSection("3 v 3 - L", 4, [beatRL, su, su, su, beatRL, su, su, su, beatRL, su, su, su]),
      oneLineSection("4 v 3 - L", 4, [beatRL, su, su, beatR, beatL, su, beatR, su, beatL, beatR, su, su]),
    ],
  ],
}

const dright8 = [beatRL, beatR, beatR, beatR, beatR, beatR, beatR, beatR]
const dleft8 = [beatRL, beatL, beatL, beatL, beatL, beatL, beatL, beatL]
const dright4 = [beatRL, beatR, beatR, beatR]
const dleft4 = [beatRL, beatL, beatL, beatL]
const dright2 = [beatRL, beatR]
const dleft2 = [beatRL, beatL]
const djan3 = [beatRL, beatRL, beatRL, su]

export const dexter: Drill = {
  id: "dexter",
  title: "Dexter",
  bpm: 4,
  rows: [
    [
      oneLineSection("Right 8s", 2, dright8),
      oneLineSection("Right 4s", 2, [...dright4, ...dright4]),
    ],
    [
      oneLineSection("Right 2s", 2, [...dright2, ...dright2, ...dright2]),
      oneLineSection("Jan Jan Jan", 1, djan3),
    ],
    [
      oneLineSection("Left 8s", 2, dleft8),
      oneLineSection("Left 4s", 2, [...dleft4, ...dleft4]),
    ],
    [
      oneLineSection("Left 2s", 2, [...dleft2, ...dleft2, ...dleft2]),
      oneLineSection("Jan Jan Jan", 1, djan3),
    ],
    [
      oneLineSection("Right 8", 1, dright8),
      oneLineSection("Left 8", 1, dleft8),
    ],
    [
      oneLineSection("Alt 4s", 2, [...dright4, ...dleft4]),
      oneLineSection("Alt 2s", 3, [...dright2, ...dleft2]),
      oneLineSection("Jan Jan Jan", 1, djan3),
    ],
  ],
}

const srr = [beat(r), su, beat(r), su]
const srr2 = [...srr, ...srr]
const sll = [beat(l), su, beat(l), su]
const sll2 = [...sll, ...sll]

const srlr = [beat(r), beat(l), beat(r), su]
const slrl = [beat(l), beat(r), beat(l), su]

const srlrl = [beat(r), beat(l), beat(r), beat(l)]
const srlrl2 = [...srlrl, ...srlrl]
const slrlr = [beat(l), beat(r), beat(l), beat(r)]
const slrlr2 = [...slrlr, ...slrlr]

export const sixteens: Drill = {
  id: "sixteens",
  title: "Sixteens",
  bpm: 8,
  beeps: [1, 3, 5, 7],
  scale: 0.5,
  rows: [
    [oneLineSection("0", 2, srr2, srr2, srr2, srr2, sll2, sll2, sll2, sll2)],
    [oneLineSection("1", 2, [...srlr, ...srr], srr2, srr2, srr2, [...slrl, ...sll], sll2, sll2, sll2)],
    [oneLineSection("2", 2, [...srlrl, ...srr], srr2, srr2, srr2, [...slrlr, ...sll], sll2, sll2, sll2)],
    [oneLineSection("3", 2, [...srlrl, ...srlr], srr2, srr2, srr2, [...slrlr, ...slrl], sll2, sll2, sll2)],
    [oneLineSection("4", 2, srlrl2, srr2, srr2, srr2, slrlr2, sll2, sll2, sll2)],
    [oneLineSection("5", 2, srlrl2, [...srlr, ...srr], srr2, srr2, slrlr2, [...slrl, ...sll], sll2, sll2)],
    [oneLineSection("6", 2, srlrl2, [...srlrl, ...srr], srr2, srr2, slrlr2, [...slrlr, ...sll], sll2, sll2)],
    [oneLineSection("7", 2, srlrl2, [...srlrl, ...srlr], srr2, srr2, slrlr2, [...slrlr, ...slrl], sll2, sll2)],
    [oneLineSection("8", 2, srlrl2, srlrl2, srr2, srr2, slrlr2, slrlr2, sll2, sll2)],
    [oneLineSection("9", 2, srlrl2, srlrl2, [...srlr, ...srr], srr2, slrlr2, slrlr2, [...slrl, ...sll], sll2)],
    [oneLineSection("10", 2, srlrl2, srlrl2, [...srlrl, ...srr], srr2, slrlr2, slrlr2, [...slrlr, ...sll], sll2)],
    [oneLineSection("11", 2, srlrl2, srlrl2, [...srlrl, ...srlr], srr2, slrlr2, slrlr2, [...slrlr, ...slrl], sll2)],
    [oneLineSection("12", 2, srlrl2, srlrl2, srlrl2, srr2, slrlr2, slrlr2, slrlr2, sll2)],
    [oneLineSection("13", 2, srlrl2, srlrl2, srlrl2, [...srlr, ...srr], slrlr2, slrlr2, slrlr2, [...slrl, ...sll])],
    [oneLineSection("14", 2, srlrl2, srlrl2, srlrl2, [...srlrl, ...srr], slrlr2, slrlr2, slrlr2, [...slrlr, ...sll])],
    [oneLineSection("15", 2, srlrl2, srlrl2, srlrl2, [...srlrl, ...srlr], slrlr2, slrlr2, slrlr2, [...slrlr, ...slrl])],
  ],
}

export const singleStrokeRoll: Drill = {
  id: "single-stroke-roll",
  title: "Single Stroke Roll",
  bpm: 8,
  beeps: [1, 3, 5, 7],
  scale: 0.5,
  rows: [
    [oneLineSection("R", 1, measure(r, su,  r, su, r, su, r, su))],
    [oneLineSection("L", 1, measure(l, su, l, su, l, su, l, su))],
    [oneLineSection("RL", 2, measure(r, l, r, l, r, l, r, l))],
  ],
}

export const doubleStrokeRoll: Drill = {
  id: "double-stroke-roll",
  title: "Double Stroke Roll",
  bpm: 8,
  beeps: [1, 3, 5, 7],
  scale: 0.5,
  rows: [
    [oneLineSection("RL", 2, measure(r, su,  l, su, r, su, l, su))],
    [oneLineSection("RRR", 2, measure(r, r, r, su, r, r, r, su))],
    [oneLineSection("RLL", 2, measure(r, su, l, l, r, su, l, l))],
    [oneLineSection("RRLL", 2, measure(r, r, l, l, r, r, l, l))],
    [oneLineSection("LR", 2, measure(l, su,  r, su, l, su, r, su))],
    [oneLineSection("LLL", 2, measure(l, l, l, su, l, l, l, su))],
    [oneLineSection("LRR", 2, measure(l, su, r, r, l, su, r, r))],
    [oneLineSection("LLRR", 2, measure(l, l, r, r, l, l, r, r))],
  ],
}

const beatRAL = beat(R, l)
const beatRLA = beat(r, L)
const beatRALA = beat(R, L)

export const oneFourSeven: Drill = {
  id: "one-four-seven",
  title: "One Four Seven",
  bpm: 4,
  rows: [
    [oneLineSection("Right", 4, [beatRLA, beatR,  beatR, beatRLA, beatR, beatR, beatRLA, beatR])],
    [oneLineSection("Left", 4, [beatRAL, beatL,  beatL, beatRAL, beatL, beatL, beatRAL, beatL])],
    [oneLineSection("Jan Right", 4, [beatRALA, beatR,  beatR, beatRALA, beatR, beatR, beatRALA, beatR])],
    [oneLineSection("Jan Left", 4, [beatRALA, beatL,  beatL, beatRALA, beatL, beatL, beatRALA, beatL])],
  ],
}

export const kihon: Drill = {
  id: "kihon",
  title: "Kihon",
  bpm: 8,
  beeps: [1, 3, 5, 7],
  rows: [
    [oneLineSection("Right (Whole)", 8, measure(R, su, su, su, su, su, su, su))],
    [oneLineSection("Left (Whole)", 8, measure(L, su, su, su, su, su, su, su))],
    [oneLineSection("Right (Half)", 8, measure(R, su, su, su, R, su, su, su))],
    [oneLineSection("Left (Half)", 8, measure(L, su, su, su, L, su, su, su))],
    [oneLineSection("Right (Quarter)", 8, measure(R, su, R, su, R, su, R, su))],
    [oneLineSection("Left (Quarter)", 8, measure(L, su, L, su, L, su, L, su))],
    [oneLineSection("Right (Eighth)", 8, measure(R, R, R, R, R, R, R, R))],
    [oneLineSection("Left (Eighth)", 8, measure(L, L, L, L, L, L, L, L))],
    [oneLineSection("Alternate (Whole)", 8,
             measure(R, su, su, su, su, su, su, su),
             measure(L, su, su, su, su, su, su, su))],
    [oneLineSection("Alternate (Half)", 8,
             measure(R, su, su, su, L, su, su, su),
             measure(R, su, su, su, L, su, su, su))],
    [oneLineSection("Alternate (Quarter)", 8,
             measure(R, su, L, su, R, su, L, su),
             measure(R, su, L, su, R, su, L, su))],
    [oneLineSection("Alternate (Eighth)", 8,
             measure(R, L, R, L, R, L, R, L),
             measure(R, L, R, L, R, L, R, L))],
    [oneLineSection("Both (Whole)", 4, [beatRALA, su, su, su, su, su, su, su])],
    [oneLineSection("Both (Half)", 4, [beatRALA, su, su, su, beatRALA, su, su, su])],
    [oneLineSection("Both (Quarter)", 4, [beatRALA, su, beatRALA, su, beatRALA, su, beatRALA, su])],
    [oneLineSection("Both (Eighth)", 4, [beatRALA, beatRALA, beatRALA, beatRALA, beatRALA, beatRALA, beatRALA, beatRALA])],
  ],
}

export const shurui: Drill = {
  id: "shurui",
  title: "Shurui",
  bpm: 4,
  rows: [
    [oneLineSection("From Top", 4, measure(R, su, L, su, R, su, L, su))],
    [oneLineSection("From Bottom", 4, measure(R, su, L, su, R, su, L, su))],
    [oneLineSection("Scissors", 4, measure(R, su, L, su, R, su, L, su))],
  ],
}

export const drills = [
  oneEAndA,
  addingAccents,
  paradiddles,
  kodoParadiddle,
  paradiddleAccents,
  paradiddleInversions,
  diddleAndA,
  bachiHakobi,
  iceSkater,
  dondoko,
  triplets,
  threeAgainstTwo,
  fourAgainstThree,
  allAgainstThree,
  dexter,
  sixteens,
  singleStrokeRoll,
  doubleStrokeRoll,
  oneFourSeven,
  kihon,
  shurui,
]
