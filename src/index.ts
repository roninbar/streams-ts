import { count, filter, foreach, head, map, pair, Stream, tail, takewhile, zip } from './streams';

function add(s1: Stream<bigint>, s2: Stream<bigint>): Stream<bigint> {
    return map((a, b) => a + b, s1, s2);
}

function scale(a: bigint, s: Stream<bigint>): Stream<bigint> {
    return map(x => a * x, s);
}

const ones = pair(1n, () => ones);

const integers = pair(0n, () => add(integers, ones));

const fibs = pair(0n, () => pair(1n, () => add(fibs, tail(fibs))));

function sieve(s: Stream<bigint>): Stream<bigint> {
    const p = head(s);
    return pair(p, () => sieve(filter(n => n % p !== 0n, tail(s))));
}

const primes = pair(2n, () => filter(function (n) {
    for (let ps = primes; head(ps) ** 2n <= n; ps = tail(ps)) {
        if (n % head(ps) === 0n) {
            return false;
        }
    }
    return true;
}, count(3n)));

const twinPrimes = filter(
    ([a, b]) => b - a === 2n,
    zip(
        primes,
        tail(primes),
    ),
);

function addDigitSeparators(p: number | bigint): string {
    return p.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function merge(...ss: Stream<bigint>[]): Stream<bigint> {

    function merge2(s1: Stream<bigint>, s2: Stream<bigint>): Stream<bigint> {
        if (!s1) {
            return s2;
        } else if (!s2) {
            return s1;
        } else if (head(s2) < head(s1)) {
            [s1, s2] = [s2, s1];
        }
        // Now, head(s1) <= head(s2)
        return pair(head(s1), () => merge2(tail(s1), head(s1) === head(s2) ? tail(s2) : s2));
    }

    return ss.reduce(merge2, null);
}


const s235: Stream<bigint> = pair(1n, () => merge(scale(2n, s235), scale(3n, s235), scale(5n, s235)));

let k = 0;
foreach(n => console.log(k++, addDigitSeparators(n)), s235);
