import {
    Paper,
    Grid,
    Avatar,
    List,
    ListItemAvatar,
    ListItemText,
    ListItem,
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

import Spinner from './Spinner';

import type { Transaction } from 'tigerspend-types';

type TransactionListProps = {
    data: Transaction[];
    isLoading: boolean;
};

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

export default function TransactionList(
    props: TransactionListProps
): JSX.Element {
    return props.isLoading ? (
        <Spinner />
    ) : (
        <Grid container justifyContent="center">
            <List sx={{ width: '80%', minWidth: 200 }}>
                {props.data.map((transaction) => (
                    <Fade bottom>
                        <Paper sx={{ m: 2 }} elevation={8}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        {getIconBySnakeCase(
                                            transaction.location.icon
                                        )}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        (transaction.amount
                                            .toString()
                                            .charAt(0) != '-'
                                            ? '+'
                                            : '') + transaction.amount
                                    }
                                    secondary={transaction.location.name}
                                />
                            </ListItem>
                        </Paper>
                    </Fade>
                ))}
            </List>
        </Grid>
    );
}
