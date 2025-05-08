/**
 * Generate all the permutations of all items in an array
 * @param arr The array
 * @returns An iterator that iterates over the permutations
 */
export const permutate = function* (arr: any[]) : Generator<any[]> {
    if (arr.length === 1)
        yield arr.slice()

    for (let i =0; i<arr.length; ++i) {
        for (const sub of permutate(arr.toSpliced(i, 1))) {
            yield [arr[i]].concat(sub)
        }
    }
}

/**
 * Generate all the circular permutations of all items in an array
 * @param arr The array
 * @returns An iterator that iterates over the permutations
 */
export const circularPermutate = function* (arr: any[]) : Generator<any[]> {
    // Circular permutations are all the permutations with one item selected as the first in the circle
    for (const sub of permutate(arr.toSpliced(0, 1))) {
        yield [arr[0]].concat(sub)
    }
}
