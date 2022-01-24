export type Delayed<T> = () => T;

export type Stream<T> = null | { first: T, rest: Delayed<Stream<T>> }

export const theEmptyStream = null;

export function force<T>(p: Delayed<T>): T {
    return p();
}

export function memoize<T>(proc: () => T): () => T {
    let alreadyRun = false;
    let result: T;
    return function () {
        if (!alreadyRun) {
            result = proc();
            alreadyRun = true;
        }
        return result;
    }
}

export function cons<T>(first: T, rest: Delayed<Stream<T>>): Stream<T> {
    return { first, rest };
}

export function first<T>(s: Stream<T>): T {
    return s.first;
}

export function rest<T>(s: Stream<T>): Stream<T> {
    return force(s.rest);
}

export function range(start: number, finish: number, step: number = 1): Stream<number> {
    return (step > 0 ? start < finish : start > finish)
        ? cons(
            start,
            () => range(start + step, finish, step),
        )
        : null;
}

export function count(start: number, step: number = 1): Stream<number> {
    return cons(
        start,
        () => count(start + step)
    );
}

export function ref<T>(n: number, s: Stream<T>): T {
    for (let i = 0; i < n; i++) {
        s = rest(s);
    }
    return first(s);
}

export function foreach<T>(proc: (T) => any, s: Stream<T>): void {
    while (s) {
        proc(first(s));
        s = rest(s);
    }
}

export function filter<T>(test: (T) => boolean, s: Stream<T>): Stream<T> {
    while (s && !test(first(s))) {
        s = rest(s);
    }
    return s ? cons(first(s), () => filter(test, rest(s))) : null;
}

export function map<T>(proc: (...args: T[]) => T, ...ss: Stream<T>[]): Stream<T> {
    return ss[0]
        ? cons(
            proc(...ss.map(first)),
            () => map(proc, ...ss.map(rest)),
        )
        : null;
}

export function takewhile<T>(test: (T) => boolean, s: Stream<T>): Stream<T> {
    return s && test(first(s))
        ? cons(
            first(s),
            () => takewhile(test, rest(s)),
        )
        : null;
}

export function dropwhile<T>(test: (T) => boolean, s: Stream<T>): Stream<T> {
    while (s && test(first(s))) {
        s = rest(s);
    }
    return s;
}

