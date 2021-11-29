import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';

import type { Transaction } from 'tigerspend-types';
import { Container } from '@mui/material';

export default function DenseTable(props: { data: Transaction[], isLoading: boolean }): JSX.Element {

  if (props.isLoading) {
    return (
      <Grid 
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh', position: "fixed" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
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
                key={row.date.getTime().toString() + row.balance}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.location.name}
                </TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                <TableCell align="right">{row.date.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}