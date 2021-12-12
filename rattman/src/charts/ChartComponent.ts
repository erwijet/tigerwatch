import React from 'react';
import type { Transaction } from 'tigerspend-types';

export declare type ChartProps = {
    spendingData: Transaction[]
}

declare type ChartState<T> = {
    loading: boolean,
    graphableData: T[]
}

export default abstract class ChartComponent<T> extends React.Component<ChartProps, ChartState<T>> {
    abstract reduce(data: Transaction[]): T[];

    constructor(props: ChartProps) {
        super(props);
        this.state = {
            loading: true,
            graphableData: [] as T[]
        }
    }

    componentDidUpdate() {
        if (this.state.graphableData.length > 0) return; // no update if data already is loaded

        this.setState(() => {
            return { loading: true };
        });

        const graphableData = this.reduce(this.props.spendingData);

        this.setState(() => {
            return { loading: false, graphableData }
        });
    }
};
