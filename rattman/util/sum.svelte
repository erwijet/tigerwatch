<script lang="ts" context="module">
    import type { AccountCode, Transaction } from 'tigerspend-types';
    import { encodeAAN } from './aan.svelte';

    export function acctSum(data: Transaction[], aan: number): number;
    export function acctSum(data: Transaction[], accts: AccountCode[]): number;

    export function acctSum(
        data: Transaction[],
        specifier: number | AccountCode[]
    ): number {
        let n: number =
            typeof specifier == 'number' ? specifier : encodeAAN(specifier);

        return data.reduce((tot, t) => {
            // if we are looking for this account and it hasn't been found yet...
            if ((1 << t.acct) & n) {
                n &= ~(1 << t.acct); // mark this account as found
                tot += t.balance;
            }
            return tot;
        }, 0);
    }
</script>
