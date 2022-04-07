import TigerwatchNavBar from '../components/TigerwatchNavBar';
import TransactionTable from '../components/TransactionTable';
import Hero from '../components/Hero';
import { selectAndSum } from '../util/format';

import type { Transaction } from '@tigerwatch/types';

function TransactionPage(props: { spendingData: Transaction[], isLoading: boolean  }) {
    return (
        <>
            <Hero
                isLoading={props.isLoading}
                balance={selectAndSum(props.spendingData, -1)}
                acctName={"Dining Dollars"}
            />
            <TransactionTable data={props.spendingData} isLoading={props.isLoading} />
            <TigerwatchNavBar />
        </>
    );
}

export default TransactionPage;