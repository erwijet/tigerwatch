<script lang="ts" context="module">
    import type {
        RawTransaction,
        Transaction,
        TransactionLocation,
        AccountCode,
    } from 'tigerspend-types';
    import cookie from 'cookie';
    import { encodeAAN } from './aan.svelte';

    function parseTransactionData(data: RawTransaction[]): Transaction[] {
        return data.map<Transaction>((unparsed) => ({
            acct: Number.parseInt(unparsed.acct),
            balance: Number.parseFloat(unparsed.balance),
            amount: Number.parseFloat(unparsed.balance),
            date: new Date(unparsed.date),
            location: unparsed.location,
        }));
    }

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
            `http://api.tigerwatch.app/aan/${skey}/${query}`
        );

        if (apiRes.status == 401)
            window.location.href = 'http://api.tigerwatch.app/auth';
        else if (apiRes.status == 200)
            return parseTransactionData(await apiRes.json());
        else throw 'api returned authed but not ok!';
    }
</script>
