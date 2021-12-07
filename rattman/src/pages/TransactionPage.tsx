import { Transaction } from 'tigerspend-types';
import TigerwatchNavBar from '../components/TigerwatchNavBar';
import TransactionTable from '../components/TransactionTable';
import Hero from '../components/Hero';

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