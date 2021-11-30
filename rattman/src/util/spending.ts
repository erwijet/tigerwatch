import type { Transaction, TransactionLocation } from 'tigerspend-types';
import type { Dispatch, SetStateAction } from 'react';

declare type ReactStateSetter<T> = Dispatch<SetStateAction<T>>;

export default async function syncSpendingData(
    skey: string,
    setIsLoading: ReactStateSetter<boolean>,
    setSpendingData: ReactStateSetter<Transaction[]>
) {
    setIsLoading(true);

    const res = await fetch(`https://api.tigerwatch.app/data/${skey}`);

    if (res.status === 401) {
        // redirect user to shib login
        window.location.href =
            'https://tigerspend.rit.edu/login.php?wason=https://api.tigerwatch.app/callback';
        setIsLoading(false);
    } else {
        const rawData = await res.json();
        setSpendingData(
            rawData.map(
                (rawEntry: {
                    date: string;
                    amount: string;
                    balance: string;
                    location: TransactionLocation;
                }): Transaction => ({
                    date: new Date(rawEntry.date),
                    amount: Number.parseFloat(rawEntry.amount),
                    balance: Number.parseFloat(rawEntry.balance),
                    location: rawEntry.location,
                })
            )
        );
        setIsLoading(false);
    }
}
