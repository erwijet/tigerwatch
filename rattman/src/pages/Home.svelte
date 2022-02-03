<script lang="ts">
    import { onMount } from 'svelte';
    import { AccountCode } from 'tigerspend-types';
    import { requestSpendingData } from '../../util/api.svelte';
    import { acctSum } from '../../util/sum.svelte';

    let sum_sdd, sum_vdd, sum_rdd, sum_tbx, sum_tot;

    onMount(async () => {
        let sd = await requestSpendingData(AccountCode.ACCT_VIRTUAL_SUM);

        sum_sdd = acctSum(sd, [AccountCode.STANDARD_DINING_DOLLARS]);
        sum_vdd = acctSum(sd, [AccountCode.VOLUNTARY_DINING_DOLLARS]);
        sum_rdd = acctSum(sd, [AccountCode.ROLLOVER_DINING_DOLLARS]);
        sum_tbx = acctSum(sd, [AccountCode.TIGER_BUCKS]);
        sum_tot = acctSum(sd, [AccountCode.ACCT_VIRTUAL_SUM]);
    });
</script>

<main>
    <ul>
        <li>Standard Dining Dollars: {sum_sdd}</li>
        <li>Voluntary Dining Dollars: {sum_vdd}</li>
        <li>Rollover Dining Dollars: {sum_rdd}</li>
        <li>Tiger Bucks: {sum_tbx}</li>
        <li>Total: {sum_tot}</li>
    </ul>
</main>
