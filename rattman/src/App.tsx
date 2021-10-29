import './App.css';
import { useState } from 'react';
import { alertTitleClasses, Button } from '@mui/material';
import io from 'socket.io-client';
import useStickyState from './useStickyState';
import TigerwatchAppBar from './components/TigerwatchAppBar';
import TransactionTable from './components/TransactionTable';
import { setServers } from 'dns';
import { Transaction, TransactionLocation } from 'tigerspend-types';

function App() {
    // eslint-disable-next-line
    const [skey, setSkey] = useStickyState<string>('', 'skey');
    const [spendingData, setSpendingData] = useState([]);

    async function validateSKey() {
        return new Promise<void>(async (resolve) => {
            const res = await fetch(`https://vps.erwijet.com/data/${skey}`);
            if (res.status === 401) {
                const socket = io('https://vps.erwijet.com');

                socket.on('message', (msg) => {
                    window.open('https://vps.erwijet.com/' + msg);
                    socket.off('message'); // only listen to first message
                });

                socket.on('skey', async ({ skey: newSkey }) => {
                    socket.disconnect(); // should disconnect from server, but we ensure it is disconnected here (WS uses a lot of battery)
                    setSkey(newSkey);
                    resolve();
                });
            } else resolve();
        });
    }

    async function syncSpendingData() {
        await validateSKey();
        const res = await fetch(`https://vps.erwijet.com/data/${skey}`);
        if (res.status === 401) {
            throw (
                'skey should have been validated but server returned 401\n' +
                'skey: ' +
                skey +
                '\n' +
                JSON.stringify(res)
            ); // should *never* happen
        } else {
            const rawData = await res.json();
            setSpendingData(
                rawData.map(
                    (rawEntry: {
                        date: string;
                        amount: string;
                        balance: string;
                        location: TransactionLocation;
                    }): Transaction => ({
                        date: new Date(rawEntry.date),
                        amount: Number.parseFloat(rawEntry.amount),
                        balance: Number.parseFloat(rawEntry.balance),
                        location: rawEntry.location,
                    })
                )
            );
        }
    }

    return (
        <div className="App">
            <TigerwatchAppBar />
            <Button variant="outlined" onClick={syncSpendingData}>
                Sync Spending Data
            </Button>
            <TransactionTable data={spendingData} />
        </div>
    );
}

export default App;
