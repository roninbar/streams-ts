export type Delayed<T> = () => T;

export type Stream<T> = null | { head: T, tail: Delayed<Stream<T>> }

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

export function pair<T>(head: T, tail: Delayed<Stream<T>>): Stream<T> {
    return { head, tail: memoize(tail) };
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

export function count(start: number, step: number = 1): Stream<number> {
    return pair(
        start,
        () => count(start + step)
    );
}

export function ref<T>(n: number, s: Stream<T>): T {
    for (let i = 0; i < n; i++) {
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

