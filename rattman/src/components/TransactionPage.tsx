import { Transaction } from 'tigerspend-types';
import TigerwatchNavBar from './TigerwatchNavBar';
import TransactionTable from './TransactionTable';
import Hero from './Hero';

function TransactionPage(props: { spendingData: Transaction[], isLoading: boolean  }) {
    return (
        <>
            <Hero
                isLoading={props.isLoading}
                title={'$' + props.spendingData[0]?.balance?.toString() + ' left'}
            />
            <TransactionTable data={props.spendingData} isLoading={props.isLoading} />
            <TigerwatchNavBar />
        </>
    );
}

export default TransactionPage;