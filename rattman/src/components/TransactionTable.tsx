import {
    Paper,
    Grid,
    Avatar,
    List,
    ListItemAvatar,
    ListItemText,
    ListItem,
    Divider,
    Chip,
} from '@mui/material';

import Restaurant from '@mui/icons-material/Restaurant';
import AttachMoney from '@mui/icons-material/AttachMoney';
import LocalCafe from '@mui/icons-material/LocalCafe';
import WineBar from '@mui/icons-material/WineBar';
import Icecream from '@mui/icons-material/Icecream';
import Fastfood from '@mui/icons-material/Fastfood';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Cookie from '@mui/icons-material/Cookie';
import LunchDining from '@mui/icons-material/LunchDining';
import RamenDining from '@mui/icons-material/RamenDining';

import CirularProgress from '@mui/material/CircularProgress';

import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef } from 'react';

import { formatBalance } from '../util/format';
import Spinner from './Spinner';

import type { Transaction } from '@tigerwatch/types';
import { AccountCode } from '@tigerwatch/acct';

type TransactionListProps = {
    data: Transaction[];
    isLoading: boolean;
    initalLoadDone: boolean;
};

function getAvatarParentBySnakeCase(key: string): JSX.Element {
    const bkColorDict: { [key: string]: string } = {
        attach_money: '#38B92F',
        shopping_cart: '#2A6ED1',
        local_cafe: '#793607',
        restaurant: '#AD241F',
    };

    let backgroundColor = bkColorDict[key] ?? '#0f0f0f';
    return (
        <Avatar sx={{ backgroundColor, color: '#ffffff' }}>
            {getIconBySnakeCase(key)}
        </Avatar>
    );
}

function getIconBySnakeCase(key: string): JSX.Element {
    switch (key) {
        case 'restaurant':
            return <Restaurant />;
        case 'attach_money':
            return <AttachMoney />;
        case 'local_cafe':
            return <LocalCafe />;
        case 'wine_bar':
            return <WineBar />;
        case 'icecream':
            return <Icecream />;
        case 'fastfood':
            return <Fastfood />;
        case 'shopping_cart':
            return <ShoppingCart />;
        case 'cookie':
            return <Cookie />;
        case 'local_shipping':
            return <LocalShipping />;
        case 'ramen_dining':
            return <RamenDining />;
        case 'lunch_dining':
            return <LunchDining />;
        default:
            return <>{key}</>;
    }
}

function getAcctNameByCode(code: number): string {
    switch (code) {
        case AccountCode.ROLLOVER_DINING_DOLLARS:
            return 'Rollover';
        case AccountCode.STANDARD_DINING_DOLLARS:
            return 'Meal Plan';
        case AccountCode.VOLUNTARY_DINING_DOLLARS:
            return 'Voluntary';
        case AccountCode.TIGER_BUCKS:
            return 'Tiger Bucks';
        default:
            throw new Error(`could not match account code ${code}`);
    }
}

function TransctionCard(props: { transactions: Transaction[] }): JSX.Element {
    const { transactions: ts } = props;

    const anim = useAnimation();
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            anim.start({
                y: 0,
                opacity: 1,
                transition: {
                    type: 'easing',
                    duration: 0.6
                },
            });
        }
    }, [inView]);

    return (
        <motion.div animate={ anim } initial={{ y: 200, opacity: 0 }} ref={ref}>
            <Paper elevation={6} sx={{ m: 1 }}>
                <ListItem>
                    <ListItemText
                        primary={<b>{ts[0].date.toDateString()}</b>}
                        secondary={
                            'Total Spent: ' +
                            formatBalance(
                                ts
                                    .map((t) => t.amount) // select amount
                                    .filter((a) => a < 0) // drop all positive values (deposits)
                                    .reduce((acc, a) => acc + a, 0) * -1 // sum amounts (and make negative)
                            )
                        }
                    />
                </ListItem>
                <Divider />
                {ts.map((t) => (
                    <ListItem
                        secondaryAction={
                            <Chip label={getAcctNameByCode(t.acct)} />
                        }
                    >
                        <ListItemAvatar>
                            {getAvatarParentBySnakeCase(t.location.icon)}
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                (t.amount < 0 ? '-' : '+') +
                                formatBalance(Math.abs(t.amount))
                            }
                            secondary={t.location.name}
                        />
                    </ListItem>
                ))}
            </Paper>
        </motion.div>
    );
}

export default function TransactionList(
    props: TransactionListProps
): JSX.Element {
    return !props.initalLoadDone ? <Spinner /> : (
        <Grid container justifyContent="center">
            <List sx={{ width: '90%', minWidth: 200 }}>
                {props.data
                    // group transactions into subarrays by date
                    .reduce(
                        (arr: any, t: Transaction) => {
                            if (
                                arr
                                    .flat()
                                    [
                                        arr.flat().length - 1
                                    ]?.date.toDateString() !=
                                t.date.toDateString()
                            )
                                arr.push([t]);
                            // if there exists no other sorted transaction with a matching date, create a new array with the current transaction
                            else arr[arr.length - 1].push(t); // otherwise, append the current transaction to the array with the matching date
                            return arr;
                        },
                        [[]]
                    )
                    .filter((ts: Transaction[]) => ts.length != 0) // drop any possible empty subarrays
                    .map(
                        (
                            ts: Transaction[] // render each array, ts, as a "day" with elements being transactions
                        ) => (
                            <motion.div
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    default: { duration: 0.8 },
                                    ease: 'easeOut',
                                }}
                                initial={{ y: 300, opacity: 0 }}
                            >
                                <TransctionCard transactions={ts} />
                            </motion.div>
                        )
                    )}
            </List>
        </Grid>
    )
}
