import {
  Drill,
  section,
  measure,
  beat,
  labeledBeat,
  R,
  r,
  rd,
  ru,
  L,
  l,
  ld,
  lu,
} from "./model"

export const kodoParadiddle: Drill = {
  title: "Paradiddle Drill",
  sections: [
    section("Accent on 1", 4, measure(R, l, r, r), measure(L, r, l, l)),
    section("Accent on 3+4", 4, measure(r, l, R, R), measure(l, r, L, L)),
    section("Accent on R", 2, measure(R, l, R, R), measure(l, R, l, l)),
    section("Accent on L", 2, measure(r, L, r, r), measure(L, r, L, L)),
    section("Accent on 4", 4, measure(r, l, r, R), measure(l, r, l, L)),
  ],
}

export const paradiddleInversions: Drill = {
  title: "Paradiddle Inversions",
  sections: [
    section("Pa-ra-did-dle", 4, measure(R, l, r, r), measure(L, r, l, l)),
    section("Ra-did-dle-pa", 4, measure(R, l, l, r), measure(L, r, r, l)),
    section("Did-dle-pa-ra", 4, measure(R, r, l, r), measure(L, l, r, l)),
    section("Dle-pa-ra-did", 4, measure(R, l, r, l), measure(L, r, l, r)),
  ],
}

export const bachiHakobi: Drill = {
  title: "Bachi Hakobi (桴運び)",
  sections: [
    section(
      "3",
      1,
      [
        labeledBeat("1", rd),
        beat(ru),
        labeledBeat("2", ld),
        beat(lu),
        labeledBeat("3", rd),
        labeledBeat("+", ru, ld),
        labeledBeat("4", rd),
        beat(ru, lu),
      ],
      [
        labeledBeat("1", ld),
        beat(lu),
        labeledBeat("2", rd),
        beat(ru),
        labeledBeat("3", ld),
        labeledBeat("+", lu, rd),
        labeledBeat("4", ld),
        beat(lu, ru),
      ],
    ),
  ],
}

export const drills = [kodoParadiddle, paradiddleInversions, bachiHakobi]
