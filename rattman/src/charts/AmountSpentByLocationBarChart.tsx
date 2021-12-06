import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    BarSeries,
} from '@devexpress/dx-react-chart-material-ui';

import type { Transaction } from 'tigerspend-types';

declare type AmountSpentByLocationBarChartProps = {
    spendingData: Transaction[];
};

function AmountSpentByLocationBarChart(
    props: AmountSpentByLocationBarChartProps
) {
    const chartData = props.spendingData
        .map((transaction) => ({
            amount: transaction.amount,
            location: transaction.location.name,
        }))
        .reduce<{ location: string, amount: number}[]>((acc, elem) => {

            for (let entry of acc) {
                if (entry.location == elem.location) {
                    entry.amount += elem.amount;
                    return acc;
                }
            }

            acc.push({ ...elem });

            return acc;
        }, [] as { location: string, amount: number }[]);

    return (
        <Chart data={chartData}>
            <ArgumentAxis />
            <ValueAxis />

            <BarSeries valueField={'amount'} argumentField={'location'} />
        </Chart>
    )
}


export default AmountSpentByLocationBarChart;
