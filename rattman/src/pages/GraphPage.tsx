import { useState } from 'react';
import { Paper } from '@mui/material';

import TigerwatchNavBar from '../components/TigerwatchNavBar';
import Spinner from '../components/Spinner';

import AmountSpentByLocationBarChart from '../charts/AmountSpentByLocationBarChart';

import type { Transaction } from 'tigerspend-types';

// update me to always reflect the number of graphs that need to be rendered
// TODO: pass a callback to each graph to update this value on graph component mount? seems like overkill idk
const TOTAL_GRAPHS = 2;

function GraphPage(props: { spendingData: Transaction[]; isLoading: boolean }) {
    const [graphsReady, setGraphsReady] = useState(0);
    const isReady = graphsReady == TOTAL_GRAPHS;

    function readyFn() {
        setGraphsReady((cur) => cur + 1);
    }

    // note: this is set aside because props.isLoading represents the loading state of the actual,
    // raw data being fetched from the api. In this situation, we don't ever want to pass an empty/undef
    // array of data to a graph-- so if it isn't loaded, we don't mount the graphs yet.
    if (props.isLoading) {
        return <Spinner />;

        // once the data has been loaded, we mount each graph but hide it behind a spinner. Once each graph
        // has reduced it's data (rendered itself), it will call the 'readyFn' callback. Once each of the
        // graphs have called the callback, the spinner blocking the graphs will hide and the graphs will be
        // visibile.

        // ps: it's like, 1am and I know that was an serious essay, but I am highkey afraid I will forget what
        // is going on in my mind rn lol
    } else {
        return (
            <>
                {!isReady && <Spinner />}
                <TigerwatchNavBar />
                <Paper elevation={4} sx={{ m: 2 }}>
                    <AmountSpentByLocationBarChart
                        spendingData={props.spendingData}
                        readyFn={readyFn}
                    />
                </Paper>
                <Paper elevation={4} sx={{ m: 2 }}>
                    <AmountSpentByLocationBarChart
                        spendingData={props.spendingData}
                        readyFn={readyFn}
                    />
                </Paper>
            </>
        );
    }
}

export default GraphPage;
