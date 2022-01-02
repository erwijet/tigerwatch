import ReactGA from 'react-ga';
import { useEffect } from 'react';
import type { Transaction } from 'tigerspend-types';
import TigerwatchNavBar from '../components/TigerwatchNavBar';
import TransactionTable from '../components/TransactionTable';
import Hero from '../components/Hero';

function TransactionPage(props: { spendingData: Transaction[], isLoading: boolean  }) {

    useEffect(() => {
        ReactGA.pageview(window.location.href);
    // eslint-disable-nextline
    }, []);

    return (
        <>
            <Hero
                isLoading={props.isLoading}
                balance={props.spendingData[0]?.balance ?? 0}
                acctName={"Dining Dollars"}
            />
            <TransactionTable data={props.spendingData} isLoading={props.isLoading} />
            <TigerwatchNavBar />
        </>
    );
}

export default TransactionPage;