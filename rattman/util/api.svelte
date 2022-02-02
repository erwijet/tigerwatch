<script lang="ts" context="module">
    import type { Transaction, AccountCode } from 'tigerspend-types';
    import cookie from 'cookie';
    import { encodeAAN } from './aan.svelte';

    export async function requestSpendingData(
        accts: AccountCode[]
    ): Promise<Transaction[]>;
    export async function requestSpendingData(
        aan: number
    ): Promise<Transaction[]>;

    export async function requestSpendingData(
        query: number | AccountCode[]
    ): Promise<Transaction[]> {
        if (typeof query != 'number') query = encodeAAN(query);
        const { skey } = cookie.parse(document.cookie) ?? { skey: '' };
        const apiRes = await fetch(
            `http://localhost:5050/aan/${skey}/${query}`
        );

        if (apiRes.status == 401)
            window.location.href = 'http://localhost:5050/dev/auth';
        else if (apiRes.status == 200)
            return (await apiRes.json()) as Transaction[];
        else throw 'api returned authed but not ok!';
    }
</script>
