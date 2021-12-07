import React from 'react';
import type { Transaction } from 'tigerspend-types';

export declare type ChartProps = {
    transactionData: Transaction[]
}

export default abstract class ChartComponent<T> extends React.Component<ChartProps> {
    constructor(props: ChartProps) {
        super(props);
    }

    abstract reduce(data: Transaction[]): T[];
};
