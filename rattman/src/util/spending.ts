import type { Transaction, TransactionLocation } from 'tigerspend-types';
import type { Dispatch, SetStateAction } from 'react';

type ReactStateSetter<T> = Dispatch<SetStateAction<T>>;

export default async function syncSpendingData(
    skey: string,
    setIsLoading: ReactStateSetter<boolean>,
    setSpendingData: ReactStateSetter<Transaction[]>
): Promise<void> {
    setIsLoading(true);

    const res = await fetch(`https://api.tigerwatch.app/data/${skey}`);

    if (res.status === 401) {
        // redirect user to shib login
        window.location.href = 'https://api.tigerwatch.app/auth';
    } else {
        const rawData = await res.json();
        setSpendingData(
            rawData.map(
                // TODO: this should be offloaded to tw/Caroline
                (rawEntry: {
                    date: string;
                    amount: string;
                    balance: string;
                    location: TransactionLocation;
                }): Transaction => ({
                    date: new Date(
                        rawEntry.date.replace('AM', ' AM').replace('PM', ' PM')
                    ),
                    amount: Number.parseFloat(rawEntry.amount),
                    balance: Number.parseFloat(rawEntry.balance),
                    location: rawEntry.location,
                })
            )
        );
        setIsLoading(false);
    }
}
