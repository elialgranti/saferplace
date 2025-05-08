import { describe, it } from "node:test"
import assert from "assert/strict"
import { PairMapBuilder } from "./Pairs"
import { findWeakestPair, getBestSeatingArrangement, getSeatingHappiness } from "./Seating"

describe("getSeatingHappiness", () => {
    it("computes happiness", () => {
        const builder = new PairMapBuilder()
        builder.addPair('a', 'b', 1)
        builder.addPair('a', 'c', -100)
        builder.addPair('a', 'd', 2)

        builder.addPair('b', 'a', 1)
        builder.addPair('b', 'c', 3)
        builder.addPair('b', 'd', -100)
        
        builder.addPair('c', 'a', -100)
        builder.addPair('c', 'b', 3)
        builder.addPair('c', 'd', 4)

        builder.addPair('d', 'a', 2)
        builder.addPair('d', 'b', -100)
        builder.addPair('d', 'c', 4)
        const map = builder.getPairMap()

        const happiness = getSeatingHappiness(['a', 'b', 'c', 'd'], map)

        assert.strictEqual(happiness, 2 + 4 + 6 + 8)
     })
})

describe("getBestSeatingArrangement", () => {
    it("computes best seating arrangement", () => {
        const builder = new PairMapBuilder()
        builder.addPair('a', 'b', 1)
        builder.addPair('a', 'c', -100)
        builder.addPair('a', 'd', 2)

        builder.addPair('b', 'a', 1)
        builder.addPair('b', 'c', 3)
        builder.addPair('b', 'd', -100)
        
        builder.addPair('c', 'a', -100)
        builder.addPair('c', 'b', 3)
        builder.addPair('c', 'd', 4)

        builder.addPair('d', 'a', 2)
        builder.addPair('d', 'b', -100)
        builder.addPair('d', 'c', 4)
        const map = builder.getPairMap()

        const arrangement = getBestSeatingArrangement(map)

        // This could fail if Set did not preserve insertion order and 'a' was not the first person
        // or if circular permutation did not pin the first item
        assert.deepStrictEqual(arrangement.seating, ['a', 'b', 'c', 'd'])
        assert.strictEqual(arrangement.happiness, 2 + 4 + 6 + 8)
     })
})


describe("findWeakestPair", () => {
    it("Finds the pair that contributes the least to happiness of the seating arrangement", () => {
        const builder = new PairMapBuilder()
        builder.addPair('a', 'b', 1)
        builder.addPair('a', 'c', -100)
        builder.addPair('a', 'd', 2)

        builder.addPair('b', 'a', 1)
        builder.addPair('b', 'c', 3)
        builder.addPair('b', 'd', -100)
        
        builder.addPair('c', 'a', -100)
        builder.addPair('c', 'b', 3)
        builder.addPair('c', 'd', 4)

        builder.addPair('d', 'a', 2)
        builder.addPair('d', 'b', -100)
        builder.addPair('d', 'c', 4)
        const map = builder.getPairMap()

        const pair = findWeakestPair(['a', 'b', 'd', 'c'], map)

        assert.deepStrictEqual(pair, {personA: 'b', personB: 'd', happiness: -200, index: 1})
     })
})