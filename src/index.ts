import { readFileSync } from "fs"
import { exit } from "process"
import { PairMapBuilder } from "./Pairs"
import { getBestSeatingArrangement as findBestSeatingArrangement, findWeakestPair, getSeatingHappiness, SeatingArrangement } from "./Seating"
import { permutate } from "./Permutate"
import { DirectedAcyclicGraph, sortGraph } from "./DirectedAcyclicGraphj"

const DEFAULT_PERMUTATIONS_DISPLAY = 100

const help = () => {
    console.log('Required parameters:')
    console.log('\tseating|dishes|(order [n])\n')
    console.log('Where:')
    console.log('\tseating - Reads the seating preferences from stdin and outputs the seating arrangement.')
    console.log('\tdishes- Reads the order constraint for the dishes from stdin and outputs the dishes order.')
    console.log('\torder [n] - Displays up to n (default ' + DEFAULT_PERMUTATIONS_DISPLAY + ') permutations of the eight people.')
}

const seating = () => {
    // Read everything from stdin (we could do it async and stream it line by line but...)
    const lines = readFileSync(0, {encoding: 'utf-8'}).replaceAll('\r', '').split('\n')
    const re = /^If (\w+) would be seated next to (\w+) s{0,1}he would be (\d+) joy points (less|more) happy.$/
    
    // Create the mutual pair map
    const builder = new PairMapBuilder()
    for (const line of lines) {
        if (line === '') {
            continue; // skip blank lines
        }
    
        const match = line.match(re)

        if (!match) {
            throw new Error(`Invalid seating definition: '${line}'`)
        }
        builder.addPair(match[1], match[2], match[4] === 'more' ? parseInt(match[3]) : -parseInt(match[3]))
    }

    const map = builder.getPairMap()

    const seatingArrangement = findBestSeatingArrangement(map)

    console.log('The best seating arrangement for the guests is ' + seatingArrangement.seating.join(', '))
    console.log('This seating arrangement has a happiness score of ' + seatingArrangement.happiness)

    const weakestPair = findWeakestPair(seatingArrangement.seating, map)
    console.log(`The best place for the host to sit is between ${weakestPair.personA} and ${weakestPair.personB}`)
    console.log(`When the host sits in this spot the overall happiness score goes ${weakestPair.happiness < 0 ? 'up' : 'down'} by ${Math.abs(weakestPair.happiness)} points`)

    // Add host to the table
    for (const guest of map.people) {
        builder.addPair('host', guest, 0)
        builder.addPair(guest, 'host', 0)
    }
    
    const newMap =  builder.getPairMap()

    const hostSeatingArrangement = {
        seating: seatingArrangement.seating.toSpliced(weakestPair.index+1, 0, 'host'),
        happiness: seatingArrangement.happiness - weakestPair.happiness
    }
    console.log('The seating arrangement with the host is ' + hostSeatingArrangement.seating.join(', '))
    console.log('This seating arrangement has a happiness score of ' + hostSeatingArrangement.happiness)

    // Find who should be removed from the table
    // This could also be a map reduce.
    let kidSeating = hostSeatingArrangement.seating.toSpliced(0, 1) // The host is never added in spot 0
    let kidHappiness = getSeatingHappiness(kidSeating, newMap)
    let kidGuest = hostSeatingArrangement.seating[0]

    for (let i=1; i<hostSeatingArrangement.seating.length; ++i) {
        if (hostSeatingArrangement.seating[i] === 'host') {
            continue
        }
        const seating = hostSeatingArrangement.seating.toSpliced(i, 1)
        const hapinness = getSeatingHappiness(seating, newMap)
        if (hapinness > kidHappiness) {
            kidSeating = seating
            kidHappiness = hapinness
            kidGuest = hostSeatingArrangement.seating[i]
        }
    }

    const happinessChange =  kidHappiness - hostSeatingArrangement.happiness
    if (happinessChange <= 0) {
        console.log(`It is best not to send anyone to the kids table, but if you must then send '${kidGuest}'`)
        console.log(`If you do the overall happiness in the table will ${happinessChange === 0 ? 'remain the same' : `go down by ${-happinessChange}`}`) 
    } else {
        console.log(`The best person to send to the kid's table is '${kidGuest}'`)
        console.log(`This will raise the happiness in the table by ${happinessChange}`)
    }

    console.log(`The seating arrangement with '${kidGuest}' in the kids table is ` + kidSeating.join(', '))
    console.log('This seating arrangement has a happiness score of ' + kidHappiness)
}


const dishes = () => {
    // Read everything from stdin (we could do it async and stream it line by line but...)
    const lines = readFileSync(0, {encoding: 'utf-8'}).replaceAll('\r', '').split('\n')
    const re = /^Dish (.+) should only be served after Dish (.+).$/

    // Create the node list from a DAG
    const root = ''
    const dag = new DirectedAcyclicGraph(root)
    for (const line of lines) {
        if (line === '') {
            continue; // skip blank lines
        }

        const match = line.match(re)

        if (!match) {
            throw new Error(`Invalid dish order definition: '${line}'`)
        }
        // We add all parent nodes to the root first to prevent a forest
        dag.addEdge(match[2], root)
        dag.addEdge(match[1], match[2])
    }
    
    const nodes = dag.updateLevels()
    sortGraph(nodes)

    console.log('The dishes should be served in the following order:\n' + nodes.slice(1).map(node => node.maxLevel + ' ' + node.key).join('\n'))
}

const order = (arr: string[], count: number) => {
    console.log(`Printing up to ${count} seating permutations:\n`)
    const gen = permutate(arr)
    let next = gen.next()
    let i =0
    while (i < count && !next.done) {
        console.log(next.value.join(', '))
        ++i
    }
}

const main = () : number => {
    if (process.argv.length < 3) {
        console.error('Invalid number of parameters');
        help()
        return 1
    }

    switch (process.argv[2]) {
        case 'seating':
            seating()
            break;
        case 'dishes':
            dishes()
            break;
        case 'order':
            const num = (process.argv.length === 3) ? DEFAULT_PERMUTATIONS_DISPLAY : parseInt(process.argv[3])
            if (isNaN(num)) {
                console.error('Invalid number of permutations to display, expecting an integer')
                help()
                return 1
            }

            order(['Elaine', 'Kosmo', 'Estelle', 'Newman', 'Jerry', 'Frank', 'George', 'Marisa'], num)
            break;
        default:
            console.error('Unknown command.')
            help()
            return 1
    }

    return 0
}


exit(main())