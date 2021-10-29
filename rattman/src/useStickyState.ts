import React, { useState, useEffect } from 'react';

export default function useStickyState<T>(
    defaultValue: T,
    key: string
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [val, setVal] = useState<T>(() => {
        const stickyValue = window.localStorage.getItem(key);

        return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(val));
    }, [key, val]);

    return [
        val,
        (v: React.SetStateAction<T>): void => {
            window.localStorage.setItem(key, JSON.stringify(v));
            setVal(v);
        },
    ];
}
