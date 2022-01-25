import { cons, count, dropwhile, filter, first, foreach, map, rest, Stream, takewhile } from './streams';

function add(s1: Stream<number>, s2: Stream<number>): Stream<number> {
    return map((a, b) => a + b, s1, s2);
}

const ones = cons(1, () => ones);

const integers = cons(1, () => add(integers, ones));

const fibs = cons(0, () => cons(1, () => add(fibs, rest(fibs))));

function sieve(s: Stream<number>): Stream<number> {
    const p = first(s);
    return cons(p, () => sieve(filter(n => n % p != 0, rest(s))));
}

const primes = cons(2, () => filter(function (n) {
    let ps = primes, p: number;
    while ((p = first(ps)) ** 2 <= n) {
        if (n % p == 0) {
            return false;
        }
        ps = rest(ps);
    }
    return true;
}, count(3)));

foreach(
    function (n) {
        console.log(n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
    },
    takewhile(
        p => p < 1_000_000,
        dropwhile(
            p => p < 1000,
            primes,
        )
    )
);