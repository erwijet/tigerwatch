import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Container,
} from '@mui/material';

import Spinner from './Spinner';

import type { Transaction } from 'tigerspend-types';

export default function DenseTable(props: {
    data: Transaction[];
    isLoading: boolean;
}): JSX.Element {
    return props.isLoading ? (
        <Spinner />
    ) : (
        <Container>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 200 }} aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Location</TableCell>
                            <TableCell align="right">Spent</TableCell>
                            <TableCell align="right">Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.data.map((row) => (
                            <TableRow
                                key={
                                    row.date.getTime().toString() + row.balance
                                }
                                sx={{'&:last-child td, &:last-child th': {}}}
                            >
                                <TableCell component="th" scope="row">
                                    {row.location.name}
                                </TableCell>
                                <TableCell align="right">
                                    {row.amount}
                                </TableCell>
                                <TableCell align="right">
                                    {row.date.toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
