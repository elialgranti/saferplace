import { describe, it } from "node:test"
import assert from "assert/strict"
import { DirectedAcyclicGraph, sortGraph } from "./DirectedAcyclicGraphj"

describe("DirectedAcyclicGraph", () => {
    it("Adds and sorts nodes", () => {
        const root = ''
        const dag = new DirectedAcyclicGraph(root) 
        dag.addEdge('b', root)
        dag.addEdge('c', 'b')
        dag.addEdge('a', 'b')
        
        const nodes = dag.updateLevels()
        sortGraph(nodes)

        assert.strictEqual(nodes.length, 4)
        assert.deepStrictEqual(nodes[0], {key: root, maxLevel: 0, descendants: ['b']})
        assert.deepStrictEqual(nodes[1], {key: 'b', maxLevel: 1, descendants: ['c', 'a']})
        assert.deepStrictEqual(nodes[2], {key: 'a', maxLevel: 2, descendants: []})
        assert.deepStrictEqual(nodes[3], {key: 'c', maxLevel: 2, descendants: []})
    })

    it("Errors when adding node to unknown parent", () => {
        const root = ''
        const dag = new DirectedAcyclicGraph(root) 
       
        assert.throws(() => dag.addEdge('c', 'a'))
    })

    it("Errors when a cycle is introduced", () => {
        const root = ''
        const dag = new DirectedAcyclicGraph(root) 
        dag.addEdge('b', root)
        dag.addEdge('a', 'b')
        dag.addEdge('b', 'a')
        
        assert.throws(dag.updateLevels)
    })

})