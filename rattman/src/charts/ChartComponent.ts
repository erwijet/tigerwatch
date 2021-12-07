import React from 'react';
import type { Transaction } from 'tigerspend-types';

export declare type ChartProps = {
    transactionData: Transaction[]
}

declare type ReducerFn<T> = (data: Transaction[]) => T[]

export default abstract class ChartComponent<T> extends React.Component<ChartProps> {
    private fn: ReducerFn<T>;
    
    constructor(props: ChartProps, fn: ReducerFn<T>) {
        super(props);
        this.fn = fn;
    }
};