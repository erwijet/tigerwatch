/**
 * Formats `balance` to a traditional currency format
 *
 * @param balance the balance to format
 * @returns the formated balance
 */
export function formatBalance(balance: number): string {
    return `$${balance.toFixed(2).toString()}`;
}
