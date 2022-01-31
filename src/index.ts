import { count, filter, foreach, head, map, pair, Stream, tail, takewhile, zip } from './streams';

function add(s1: Stream<number>, s2: Stream<number>): Stream<number> {
    return map((a, b) => a + b, s1, s2);
}

const ones = pair(1, () => ones);

const integers = pair(0, () => add(integers, ones));

const fibs = pair(0, () => pair(1, () => add(fibs, tail(fibs))));

function sieve(s: Stream<number>): Stream<number> {
    const p = head(s);
    return pair(p, () => sieve(filter(n => n % p != 0, tail(s))));
}

const primes = pair(2, () => filter(function (n) {
    for (let ps = primes; head(ps) ** 2 <= n; ps = tail(ps)) {
        if (n % head(ps) == 0) {
            return false;
        }
    }
    return true;
}, count(3)));

const twinPrimes = filter(
    ([a, b]) => b - a === 2,
    zip(
        primes,
        tail(primes),
    ),
);

function addDigitSeparators(p: number): string {
    return p.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

const table = [];

// let i = 0;

foreach(
    table.push.bind(table),
    // ([p]) => console.log(`${i++}, ${p}`),
    takewhile(
        ([p]) => p < 1_000_000,
        twinPrimes,
    ),
);

console.table(table);

