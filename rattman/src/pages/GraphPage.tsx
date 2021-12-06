import { Paper } from '@mui/material';

import TigerwatchNavBar from '../components/TigerwatchNavBar';
import AmountSpentByLocationBarChart from '../charts/AmountSpentByLocationBarChart';

import type { Transaction } from 'tigerspend-types';

function GraphPage(props: { spendingData: Transaction[], isLoading: boolean  }) {
    return (
        <>
            <TigerwatchNavBar />
            <Paper>
                <AmountSpentByLocationBarChart { ...props }/>
            </Paper>
        </>
    );
}

export default GraphPage;
