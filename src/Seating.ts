import { PairMap } from "./Pairs"
import { circularPermutate } from "./Permutate"


/**
 * Gets the happiness of the seating arrangement given the mutual happiness defined in a PairMap
 * @param seating The seating arrangement
 * @param map The PairMap 
 * @returns The happiness score
 */
export const getSeatingHappiness = (seating: string[], map: PairMap) : number => {
    // This is what a map reduce looks like
    return seating
        // Get the mutual happiness of the current person and the next one in the table
        .map((person, index, seating) => map.getHappiness(person, seating[(index + 1) % seating.length]))
        // Get a sum of the happiness
        .reduce((sum, value) => sum+value, 0)
}

export type SeatingArrangement = {
    seating: string[],
    happiness: number
}

/**
 * Gets the best possible arrangement of a circular table given the mutual happiness as defined in a PairMap
 * @param map The PairMap
 * @returns The best possible seating arrangement and associated happiness
 */
export const getBestSeatingArrangement = (map: PairMap) : SeatingArrangement => {
    const people = [...map.people.keys()]

    const it = circularPermutate(people)

    // Note this can also be done in a map reduce or using functional libraries with max like lodash
    let maxSeating = it.next().value
    let maxHappiness = getSeatingHappiness(maxSeating, map)
    for (const seating of circularPermutate(people)) {
        const happiness = getSeatingHappiness(seating, map)
        if (maxHappiness < happiness) {
            maxHappiness = happiness
            maxSeating = seating
        }
    }
    return {
        seating: maxSeating,
        happiness: maxHappiness
    }
}


export type Pair = {
    happiness: number,
    personA: string,
    personB: string,
    index: number
}

/**
 * For a seating arrangement and the given the mutual happiness defined in a PairMap finds the
 * pairs seating next to each other that contribute the least to the happiness
 * 
 * @param seating The seating arrangement
 * @param map The pair map
 * @returns 
 */
export const findWeakestPair = (seating: string[], map: PairMap) : Pair => {
    // The happiness of the first pair. This is the happiness to beat.
    const initialResult : Pair = {
        happiness: map.getHappiness(seating[0], seating[1]),
        personA: seating[0],
        personB: seating[1],
        index: 0
    }

    // Woohoo! Another map reduce. Map/filter/reduce are the base of many functional implementations of algorithms.
    // Algorithms that can be expressed as a map/filter/reduce can be easily parallelized. This is the basis for what hadoop does.
    return seating
        // Map the arrays into objects with the person names and the happiness. Too bad javascript still has no records
        .map((personA, index, seating) => {
            const personB = seating[(index + 1) % seating.length]
            return {
                happiness: map.getHappiness(personA, personB),
                personA: personA,
                personB: personB,
                index: index
            }
        })
        // Get the result with the minimum happiness
        .reduce((prev, value) => value.happiness < prev.happiness ? value : prev, initialResult)
}