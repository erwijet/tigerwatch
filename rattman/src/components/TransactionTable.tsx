import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import type { Transaction } from 'tigerspend-types';

export default function DenseTable(props: { data: Transaction[] }): JSX.Element {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
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
              key={row.date.getTime().toString()}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.location.name}
              </TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}