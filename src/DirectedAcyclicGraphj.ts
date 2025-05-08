import { cursorTo } from "readline"

type Node = {
    readonly key: string
    maxLevel: number
    readonly descendants: string[]
}

/**
 * Builds a DAG
 */
export class DirectedAcyclicGraph {
    private nodes: Map<string, Node>

    /**
     * @param root The name of the root node
     */
    constructor(
        public root: string
    ) {
        this.nodes = new Map()
        this.nodes.set(root, {key: root, maxLevel: 0, descendants: []})
    }

    /**
     * 
     * @param key Adds an edge to the DAG
     * @param parent 
     */
    public readonly addEdge = (key: string, parent: string ) => {
        const parentNode = this.nodes.get(parent)
        if (parentNode === undefined) {
            throw new Error('Unknown parent node.')
        }

        if (!this.nodes.has(key)) {
            this.nodes.set(key, {key: key, maxLevel: 0, descendants: []})
        }

        parentNode.descendants.push(key)
    }

    /**
     * Calculates the maximum level of each Node and returns a list of the nodes in the DAG
     * @returns The current list of nodes with the maxLevel updated
     * @throws {Error} If a cycle exists in the graph.
     */
    public readonly updateLevels = () : Node[] => {
        const stack: string[] = []

        // Do DSF to get the maxLevel of each node

        let current : string | undefined = this.root
        
        while (current !== undefined) {
            const currentNode = <Node>this.nodes.get(current)
            for (const descendant of currentNode.descendants) {
                const descendantNode = <Node>this.nodes.get(descendant)

                if (descendantNode.maxLevel < currentNode.maxLevel + 1) {
                    descendantNode.maxLevel = currentNode.maxLevel + 1
                    if (descendantNode.maxLevel >= this.nodes.size ) {
                        throw new Error('The directed graph is not acyclic.')
                    }

                    stack.push(...currentNode.descendants)
                }
            }
            current = stack.pop()
        }

        return [...this.nodes.values()]
    }
}

/**
 * Sorts the nodes in the graph by maxLevel and then alphabetically by key
 * The array defining the graph is sorted in place.
 */
export const sortGraph = (nodes: Node[]) : void => {
    nodes.sort((a, b) => {
        if (a.maxLevel > b.maxLevel) {
            return 1
        }
        if (a.maxLevel < b.maxLevel) {
            return -1
        }
        // levels are equal
        if (a.key > b.key) {
            return 1
        }

        if (a.key < b.key) {
            return -1
        }
        // levels and keys are equal
        return 0
    })
}