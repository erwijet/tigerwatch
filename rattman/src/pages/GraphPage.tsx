import TigerwatchNavBar from '../components/TigerwatchNavBar';

import type { Transaction } from 'tigerspend-types';

function GraphPage(props: { spendingData: Transaction[], isLoading: boolean  }) {
    return (
        <>
            <TigerwatchNavBar />
        </>
    );
}

export default GraphPage;
