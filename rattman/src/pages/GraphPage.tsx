import { Paper } from '@mui/material';

import TigerwatchNavBar from '../components/TigerwatchNavBar';
import AmountSpentByLocationBarChart from '../charts/AmountSpentByLocationBarChart';

import type { Transaction } from 'tigerspend-types';

function GraphPage(props: { spendingData: Transaction[], isLoading: boolean  }) {
    return (
        <>
            <TigerwatchNavBar />
            <Paper elevation={4} sx={{m: 2}}>
                <AmountSpentByLocationBarChart { ...props }/>
            </Paper>
        </>
    );
}

export default GraphPage;
