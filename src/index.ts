import { cons, dropwhile, foreach, map, rest, Stream, takewhile } from './streams';

function add(s1: Stream<number>, s2: Stream<number>): Stream<number> {
    return map((a, b) => a + b, s1, s2);
}

const ones = cons(1, () => ones);

const integers = cons(1, () => add(ones, integers));

const fibs = cons(0, () => cons(1, () => add(rest(fibs), fibs)));

foreach(
    console.log,
    takewhile(
        p => p < 1_000_000,
        dropwhile(
            p => p < 1000,
            fibs,
        )
    )
);