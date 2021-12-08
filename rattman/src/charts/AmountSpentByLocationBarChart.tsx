import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    BarSeries,
} from '@devexpress/dx-react-chart-material-ui';

import Spinner from '../components/Spinner';
import ChartComponent, { ChartProps } from './ChartComponent';
import type {Transaction} from 'tigerspend-types';

declare type Graphable = {
    location: string,
    amount: number
}

class AmountSpentByLocationBarChart extends ChartComponent<Graphable> {
    /**
     * @override
     */
    reduce(data: Transaction[]) {
        return data
            .map(transaction => ({
                amount: Math.abs(transaction.amount),
                location: transaction.location.name
            }))
            .filter(({location}) => location != 'Deposit')
            .reduce<Graphable[]>((acc, elem) => {
                for (let entry of acc) {
                    if (entry.location == elem.location) {
                        entry.amount += elem.amount;
                        return acc;
                    }
                }

                acc.push({...elem});
                return acc;
            }, [])
            .sort((a, b) => a.amount - b.amount);
    }

    render() {
        return this.state.loading ? <Spinner /> : (
            <Chart data={this.reduce(this.props.spendingData)} rotated={true}>
                <ArgumentAxis />
                <ValueAxis />

                <BarSeries valueField={'amount'} argumentField={'location'} />
            </Chart>
        )
    }
}



export default AmountSpentByLocationBarChart;
