import React from 'react';
import type { Transaction } from 'tigerspend-types';

export type ChartProps = {
    spendingData: Transaction[];
    readyFn: () => void;
};

type ChartState<T> = {
    graphableData: T[];
};

export default abstract class ChartComponent<T> extends React.Component<
    ChartProps,
    ChartState<T>
> {
    abstract reduce(data: Transaction[]): T[];

    constructor(props: ChartProps) {
        super(props);
        this.state = {
            graphableData: [] as T[],
        };
    }

    componentDidMount() {
        const graphableData = this.reduce(this.props.spendingData);
        this.setState(() => ({
            graphableData,
        }));

        console.log('calling ready');
        this.props.readyFn(); // announce to parent that this particular graph's data has been processed
    }
}
