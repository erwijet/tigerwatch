import ReactGA from 'react-ga';
import { useEffect } from 'react';
import type { Transaction } from '@tigerwatch/types';
import TigerwatchNavBar from '../components/TigerwatchNavBar';
import TransactionTable from '../components/TransactionTable';
import Hero from '../components/Hero';
import { selectAndSum } from '../util/format';

function TransactionPage(props: { spendingData: Transaction[], isLoading: boolean  }) {

    useEffect(() => {
        ReactGA.pageview(window.location.href);
    // eslint-disable-nextline
    }, []);

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