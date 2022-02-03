<script lang="ts" context="module">
    import { action_destroyer } from 'svelte/internal';

    import { AccountCode } from 'tigerspend-types';

    /**
     * encode a set of {@see AccountCode} values into a single,
     * Aggregate Account Number. This is the numeric representation of a
     * set of accounts.
     *
     * @returns the Aggregate Account Number
     * @param accts the set of AccountCodes to encode
     */
    export function encodeAAN(accts: AccountCode[]): number {
        if (accts.includes(AccountCode.ACCT_VIRTUAL_SUM)) return ~(0 << 0);

        let aan = 0;
        for (let acct of accts) {
            aan |= 1 << acct;
        }

        return aan;
    }

    /**
     * decode a single Aggregate account number into a list of {@see AccountCodes}
     *
     * note that if the {@see AccountCodes.ACCT_VIRTUAL_SUM} account was encoded, it will
     * be the only one returned, as it represents all possible accounts
     * @return the list of account codes
     * @param aan the Aggregate Account Number to decode
     */
    export function decodeAAN(aan: number): AccountCode[] {
        const accts = [];

        // ~(0 << 0) is just -1. note how ~(0 << 0) | (1 << n) = ~(0 << 0) for 0 <= n <= 31
        if (aan == ~(0 << 0)) return [AccountCode.ACCT_VIRTUAL_SUM];
        for (let i of Object.values(AccountCode)) {
            i = i as number;
            if (aan & (1 << i)) {
                accts.push(1 << i);
                aan &= ~(1 << i); // remove (1 << i) from aan
            }
        }

        if (aan != 0) throw 'invalid aan';
        return accts;
    }

    export function isAcctCode(n: number): n is AccountCode {
        return Object.values(AccountCode).includes(n);
    }

    export function isAcctCodeList(l: number[]): l is AccountCode[] {
        for (let n of l) {
            if (!isAcctCode(n)) return false;
        }

        return true;
    }
</script>
