export type Delayed<T> = () => T;

export type Stream<T> = null | { head: T, tail: Delayed<Stream<T>> }

export const theEmptyStream = null;

export function force<T>(p: Delayed<T>): T {
    return p();
}

export function memo<T>(proc: () => T): () => T {
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

export function pair<T>(head: T, tail: Delayed<Stream<T>>): Stream<T> {
    return { head, tail: memo(tail) };
}

export function head<T>(s: Stream<T>): T {
    return s.head;
}

export function tail<T>(s: Stream<T>): Stream<T> {
    return force(s.tail);
}

export function range(start: number, finish: number, step: number = 1): Stream<number> {
    return (step > 0 ? start < finish : start > finish)
        ? pair(
            start,
            () => range(start + step, finish, step),
        )
        : null;
}

export function count(start: bigint, step: bigint = 1n): Stream<bigint> {
    return pair(
        start,
        () => count(start + step)
    );
}

export function ref<T>(n: number | bigint, s: Stream<T>): T {
    while (n-- > 0) {
        s = tail(s);
    }
    return head(s);
}

export function foreach<T>(proc: (value: T) => any, s: Stream<T>): void {
    while (s) {
        proc(head(s));
        s = tail(s);
    }
}

export function filter<T>(test: (value: T) => boolean, s: Stream<T>): Stream<T> {
    while (s && !test(head(s))) {
        s = tail(s);
    }
    return s ? pair(head(s), () => filter(test, tail(s))) : null;
}

export function map<T, S>(proc: (...args: T[]) => S, ...ss: Stream<T>[]): Stream<S> {
    return ss[0]
        ? pair(
            proc(...ss.map(head)),
            () => map(proc, ...ss.map(tail)),
        )
        : null;
}

export function zip<T1, T2>(s1: Stream<T1>, s2: Stream<T2>): Stream<(T1 | T2)[]> {
    return map<T1 | T2, (T1 | T2)[]>((a, b) => [a, b], s1, s2);
}

export function takewhile<T>(test: (value: T) => boolean, s: Stream<T>): Stream<T> {
    return s && test(head(s))
        ? pair(
            head(s),
            () => takewhile(test, tail(s)),
        )
        : null;
}

export function dropwhile<T>(test: (value: T) => boolean, s: Stream<T>): Stream<T> {
    while (s && test(head(s))) {
        s = tail(s);
    }
    return s;
}

