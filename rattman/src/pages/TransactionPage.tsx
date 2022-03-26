import ReactGA from 'react-ga';
import { useEffect, useState } from 'react';
import type { Transaction } from '@tigerwatch/types';
import TigerwatchNavBar from '../components/TigerwatchNavBar';
import TransactionTable from '../components/TransactionTable';
import Spinner from '../components/Spinner';
import Hero from '../components/Hero';
import { selectAndSum } from '../util/format';
import { CircularProgress } from '@mui/material';

function TransactionPage(props: { spendingData: Transaction[], isLoading: boolean, nextChunk: () => void  }) {

    function onScroll(_e: any) {
        const scrollThresh = ((document.documentElement.scrollHeight - document.documentElement.clientHeight)) - window.scrollY;

        if (scrollThresh < 100 && !props.isLoading)
             props.nextChunk();
    }

    const [ initalLoadDone, setInitalLoadDone ] = useState(false);

    useEffect(() => ReactGA.pageview(window.location.href), []);

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [props.isLoading, props.spendingData]);

    useEffect(() => {
        if (!props.isLoading) setInitalLoadDone(true);
    }, [props.isLoading]);

    return (
        props.isLoading && !initalLoadDone ? ( <Spinner />) : (
        <>
            <Hero
                isLoading={props.isLoading}
                balance={selectAndSum(props.spendingData, -1)}
                acctName={"Dining Dollars"}
            />
            <TransactionTable data={props.spendingData} initalLoadDone={initalLoadDone} isLoading={props.isLoading} />
            { props.isLoading && initalLoadDone ? ( <div style={{paddingTop: '50px', paddingBottom: '150px'}}><CircularProgress style={{color: '#F76902', }} /></div>) : null } 
            <TigerwatchNavBar />
        </>
        )
    );
}

export default TransactionPage;
