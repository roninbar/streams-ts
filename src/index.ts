import { count, dropwhile, filter, foreach, head, map, pair, Stream, tail, takewhile } from './streams';

function add(s1: Stream<number>, s2: Stream<number>): Stream<number> {
    return map((a, b) => a + b, s1, s2);
}

function scale(a: number, s: Stream<number>): Stream<number> {
    return map(x => a * x, s);
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
    return map<T1 | T2, (T1 | T2)[]>((a, b) => [a, b], s1, s2);
}

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

function merge(...ss: Stream<number>[]): Stream<number> {
    return ss.reduce(merge2, null);
}

function merge2(s1: Stream<number>, s2: Stream<number>): Stream<number> {
    if (!s1) {
        return s2;
    } else if (!s2) {
        return s1;
    } else {
        return head(s1) < head(s2)
            ? pair(head(s1), () => merge2(
                tail(s1),
                s2))
            : pair(head(s2), () => merge2(
                tail(s2),
                head(s2) < head(s1)
                    ? s1
                    : tail(s1)));
    }
}

const ex56: Stream<number> = pair(1, () => merge(scale(2, ex56), scale(3, ex56), scale(5, ex56)));

let k = 0;
foreach(n => console.log(k++, addDigitSeparators(n)), takewhile(n => n < 1_000_000, ex56));
