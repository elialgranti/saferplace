import { describe, it } from "node:test"
import assert from "assert/strict"
import { PairMapBuilder } from "./Pairs"

describe("The PairMapBuilder", () => {
    it("Creates a PairMap", () => {
        const builder = new PairMapBuilder();

        builder.addPair("a", "b", 1)
        builder.addPair("a", "c", 2)
        builder.addPair("b", "a", 3)
        builder.addPair("b", "c", 4)
        builder.addPair("c", "a", 5)
        builder.addPair("c", "b", 6)

        assert.ok(builder.getPairMap() instanceof Object)
    })

    it("Validates no duplicate pairs", () => {
        const builder = new PairMapBuilder();

        builder.addPair("a", "b", 1)

        assert.throws(() => builder.addPair("a", "b", 2))
    })

    it("Validates no same person", () => {
        const builder = new PairMapBuilder();

        assert.throws(() => builder.addPair("a", "a", 1))
    })

    it("Validates no missing pair", () => {
        const builder = new PairMapBuilder();

        builder.addPair("a", "b", 1)
        builder.addPair("a", "c", 2)
        // Missing: builder.addPair("b", "a", 3)
        builder.addPair("b", "c", 4)
        builder.addPair("c", "a", 5)
        builder.addPair("c", "b", 6)

        assert.throws(builder.getPairMap)
    })
})
