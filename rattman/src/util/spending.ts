import type { Transaction, RawTransaction } from '@tigerwatch/types';
import type { Dispatch, SetStateAction } from 'react';

import { formatDate } from './format';

type ReactStateSetter<T> = Dispatch<SetStateAction<T>>;

export default async function syncSpendingData(
    skey: string,
    setIsLoading: ReactStateSetter<boolean>,
    setSpendingData: ReactStateSetter<Transaction[]>
): Promise<void> {
    setIsLoading(true);

    if (!skey || skey == '') skey = '-';

    const res = await fetch(`${import.meta.env.VITE_DATA_AAN_ROUTE}${skey}/-1`);

    if (res.status === 401) {
        window.location.href = import.meta.env.VITE_AUTH_ROUTE;
    } else {
        const rawData = await res.json();
        setSpendingData(
            rawData.map(
                ({
                    date,
                    acct,
                    amount,
                    balance,
                    location,
                }: RawTransaction): Transaction => ({
                    date: new Date(date),
                    acct: Number.parseFloat(acct),
                    amount: Number.parseFloat(amount),
                    balance: Number.parseFloat(balance),
                    location,
                })
            )
        );
        setIsLoading(false);
    }
}

/**
 * Pull new spending data--
 *
 * this requires refreshing the current skey, so we drop the current one we have (if one even exists)
 * and request a new one from tigerspend.rit.edu
 */
export function refreshData(setIsLoading: ReactStateSetter<boolean>) {
    window.location.href = import.meta.env.VITE_AUTH_ROUTE; // will autoshib if session exists, otherwise user will do shib auth
}

/**
 * Gets the i'th chunk of data, where each chunk is a 7-day block of spending data.
 *
 * @param i the chunk index to get
 * @param skey the skey
 * @param setSpendingData the method to set the spending data state
 */
export async function getChunk(
    i: number,
    skey: string,
    setSpendingData: ReactStateSetter<Transaction[]>,
    setNoMoreChunks: ReactStateSetter<boolean>,
    setIsLoading: ReactStateSetter<boolean>
): Promise<void> {
    setIsLoading(true);

    const DAYS_PER_CHUNK = 7;

    let earliestDate = new Date();
    let oldestDate = new Date();

    earliestDate.setDate(earliestDate.getDate() - DAYS_PER_CHUNK * (i - 1));
    oldestDate.setDate(oldestDate.getDate() - DAYS_PER_CHUNK * i);

    if (earliestDate.getMonth() === 0) {
        earliestDate.setMonth(12);
        earliestDate.setFullYear(earliestDate.getFullYear() - 1);
    }

    if (oldestDate.getMonth() === 0) {
        oldestDate.setMonth(12);
        oldestDate.setFullYear(earliestDate.getFullYear() - 1);
    }

    const res = await fetch(
        `${import.meta.env.VITE_DATA_AAN_ROUTE}${skey || '-'}/-1?o=${formatDate(
            oldestDate
        )}&e=${formatDate(earliestDate)}`
    );

    if (res.status === 401) {
        window.location.href = import.meta.env.VITE_AUTH_ROUTE;
    } else {
        const rawData = await res.json();
        if (rawData.length == 0) setNoMoreChunks(true);

        setSpendingData((curSpendingData) =>
            curSpendingData.concat(
                rawData.map(
                    ({
                        date,
                        acct,
                        amount,
                        balance,
                        location,
                    }: RawTransaction): Transaction => ({
                        date: new Date(date),
                        acct: Number.parseFloat(acct),
                        amount: Number.parseFloat(amount),
                        balance: Number.parseFloat(balance),
                        location,
                    })
                )
            )
        );
    }

    if (setIsLoading) setIsLoading(false);
}
