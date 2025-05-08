import { error } from "console"

const directedPairKey = (a: string, b: string): string => a.replaceAll('#', '##') + '#' + b.replaceAll('#', '##')
const invariantPairKey = (a: string, b: string): string => a <= b ? directedPairKey(a, b) : directedPairKey(b, a) 
/**
 * Class used to build and validate a PairMap
 */
export class PairMapBuilder {
    /**
     * Internal structure to hold the pair and their directed happiness
     */
    private readonly directedPairs: Map<string, number> = new Map()

    /**
     * Internal structure to keep track of the people
     */
    private readonly people: Set<string> = new Set()

    /**
     * Adds a pair to the PairMap
     * @param a The name of person A
     * @param b The name of person B
     * @param happiness The happines of person A when seated next to person B
     * 
     * @throws {Error} If the directed pair added already exists or if person A is the same as person B 
     */
    public readonly addPair = (a: string, b: string, happiness: number): void => {
        if (a === b) {
            throw new Error(`Defining the hapinness of ${a} when seated next to itself is invalid.`)
        }

        const key = directedPairKey(a, b)
        if (this.directedPairs.has(key)) {
            throw new Error(`Happiness of ${a} when seated next to  ${b} already defined.`)
        }
        this.directedPairs.set(key, happiness)
        this.people.add(a)
        this.people.add(b)
    }

    /**
     * Validates the pair definitions and builds the PairMap.
     * 
     * The pair definitions are valid if and only if every two persons (a,b) have exactly two directed pairs a -> b and b -> a
     * 
     * @returns The PairMap with all the pairs and their mutual happiness
     * 
     * @throws {Error} If the pair definitions are invalid. 
     */
    public readonly getPairMap = (): PairMap => {

        // Create a map of maps records the mutual hapinness of every person when seated next to every other person
        const mutualMap: Map<string, number> = new Map();
        for (const a of this.people) {
            for (const b of this.people) {
                if (a === b) {
                    continue;
                }
                const ab = this.directedPairs.get(directedPairKey(a, b))
                if (ab === undefined) {
                    throw new Error(`Hapinness of ${a} when seated next to ${b} has not been defined.`)
                }
                const ba = this.directedPairs.get(directedPairKey(b, a))
                if (ba === undefined) {
                    throw new Error(`Hapinness of ${b} when seated next to ${a} has not been defined.`)
                }

                mutualMap.set(invariantPairKey(a, b), ab + ba)
            }
        }

        return new ConcretePairMap(mutualMap, new Set(this.people));
    }
}

/**
 * A structure for building the happiest chain.
 * Contains all the pairs and their mutual happiness
 */
export interface PairMap {
    people: Set<string>
    /**
    * @param a The name of person A
    * @param b The name of person B
    * @returns The happines of persons A and B when seated next to each other
    * @throws {Error} If the pair is not found. 
    */
    getHappiness: (a: string, b: string) => number
}

class ConcretePairMap implements PairMap {
    constructor(
        private readonly mutualMap: Map<string, number>,
        public readonly people: Set<string>
    ) { }

    public readonly getHappiness = (a: string, b: string) : number => {
        const hapinness = this.mutualMap.get(invariantPairKey(a, b))

        if (hapinness === undefined) {
            throw new Error('Pair not invited.')
        }

        return hapinness
    }    
}
