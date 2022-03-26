import type { Transaction } from '@tigerwatch/types';

/**
 * Formats `balance` to a traditional currency format
 *
 * @param balance the balance to format
 * @returns the formated balance
 */
export function formatBalance(balance: number): string {
    return `$${balance.toFixed(2).toString()}`;
}

export function selectAndSum(data: Transaction[], aan: number): number {
    return data.reduce((sum, t) => {
        if (aan & (1 << t.acct)) {
            sum += t.balance;
            aan &= ~(1 << t.acct);
        }

        return sum;
    }, 0);
}

function padDate(n: number, size: number): string {
    let str = n.toString();

    for (let i = 0; i < size - str.length; i++) {
        str = '0' + str;
    }

    return str;
}

export function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    return `${padDate(y, 4)}-${padDate(m, 2)}-${padDate(d, 2)}`;
}
