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
