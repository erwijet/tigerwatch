import {
    Paper,
    Grid,
    Avatar,
    List,
    ListItemAvatar,
    ListItemText,
    ListItem,
    Divider,
    Chip
} from '@mui/material';
import {
    Restaurant,
    AttachMoney,
    LocalCafe,
    WineBar,
    Icecream,
    Fastfood,
    ShoppingCart,
    LocalShipping,
    Cookie,
    LunchDining,
    RamenDining,
} from '@mui/icons-material';
import { Fade } from 'react-reveal';

import { formatBalance } from '../util/format';
import Spinner from './Spinner';

import type { Transaction } from '@tigerwatch/types';
import { AccountCode } from '@tigerwatch/acct';

type TransactionListProps = {
    data: Transaction[];
    isLoading: boolean;
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

export default function TransactionList(
    props: TransactionListProps
): JSX.Element {
    return props.isLoading ? (
        <Spinner />
    ) : (
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
                            else arr[arr.length - 1].push(t);
                            return arr;
                        },
                        [[]]
                    )
                    .filter((ts: Transaction[]) => ts.length != 0).map((ts: Transaction[]) => (
                        <Fade bottom>
                            <Paper elevation={6} sx={{ m: 1 }}>
                                <ListItem>
                                    <ListItemText primary={ <b>{ts[0].date.toDateString()}</b> } secondary={ 'Total Spent: ' + formatBalance(ts.map(t => t.amount).filter(a => a < 0).reduce((acc, a) => acc + a, 0) * (-1)) }/>
                                </ListItem>
                                <Divider />
                                {ts.map((t) => (
                                    <ListItem secondaryAction={
                                        <Chip label={getAcctNameByCode(t.acct)} />
                                    }>
                                        <ListItemAvatar>
                                            {getAvatarParentBySnakeCase(
                                                t.location.icon
                                            )}
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                ((t.amount < 0) ? '-' : '+') + formatBalance(Math.abs(t.amount))
                                            }
                                            secondary={t.location.name  }
                                        />
                                    </ListItem>
                                ))}
                            </Paper>
                        </Fade>
                    ))}
            </List>
        </Grid>
    );
}
