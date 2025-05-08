import { describe, it } from "node:test"
import assert from "assert/strict"
import { permutate } from "./Permutate"

describe("permutate", () => {
    it("Generates permutations", () => {
        const permutations = [...permutate([1,2,3])]

        assert.strictEqual(permutations.length, 6)
        // all permutations should be different
        for (let u = 0; u < permutations.length - 1; ++u) {
            for (let v=u+1; v < permutations.length; ++v) {
                assert.notDeepStrictEqual(permutations[u], permutations[v])
            }
        }
    })
})