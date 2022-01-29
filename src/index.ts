import { pair, count, dropwhile, filter, head, foreach, map, tail, Stream, takewhile } from './streams';

function add(s1: Stream<number>, s2: Stream<number>): Stream<number> {
    return map((a, b) => a + b, s1, s2);
}

const ones = pair(1, () => ones);

const integers = pair(1, () => add(integers, ones));

const fibs = pair(0, () => pair(1, () => add(fibs, tail(fibs))));

function sieve(s: Stream<number>): Stream<number> {
    const p = head(s);
    return pair(p, () => sieve(filter(n => n % p != 0, tail(s))));
}

const primes = pair(2, () => filter(function (n) {
    let ps = primes, p: number;
    while ((p = head(ps)) ** 2 <= n) {
        if (n % p == 0) {
            return false;
        }
        ps = tail(ps);
    }
    return true;
}, count(3)));

function zip<T1, T2>(s1: Stream<T1>, s2: Stream<T2>): Stream<(T1 | T2)[]> {
    return map<T1 | T2, (T1 | T2)[]>((a, b) => [a as T1, b as T2], s1, s2);
}

const twinPrimes = filter(
    ([a, b]) => b - a === 2,
    zip(
        primes,
        tail(primes),
    ),
);

foreach(
    // function (twins) {
    //     console.log(twins.map(p => p.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')).join(' - '));
    // },
    console.log,
    takewhile(
        ([p]) => p < 1_000_000,
        dropwhile(
            ([p]) => p < 100_000,
            twinPrimes,
        )
    )
);