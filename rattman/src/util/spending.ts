import type { Transaction, RawTransaction } from '@tigerwatch/types';
import type { Dispatch, SetStateAction } from 'react';

import { encodeAAN } from '@tigerwatch/aan';
import { AccountCode } from '@tigerwatch/acct';

type ReactStateSetter<T> = Dispatch<SetStateAction<T>>;

export default async function syncSpendingData(
    skey: string,
    setIsLoading: ReactStateSetter<boolean>,
    setSpendingData: ReactStateSetter<Transaction[]>
): Promise<void> {
    setIsLoading(true);
    skey ||= '-';

    const res = await fetch(
        `https://api.tigerwatch.app/aan/${skey}/${encodeAAN([
            AccountCode.VOLUNTARY_DINING_DOLLARS,
        ])}`
    );

    if (res.status === 401) {
        // redirect user to shib login
        window.location.href = 'https://api.tigerwatch.app/auth';
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
    setIsLoading(true);
    window.location.href = 'https://api.tigerwatch.app/auth'; // will autoshib if session exists, otherwise user will do shib auth
}
