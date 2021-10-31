import './App.css';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TigerwatchAppBar from './components/TigerwatchAppBar';
import TransactionTable from './components/TransactionTable';
import Hero from './components/Hero';
import { Transaction, TransactionLocation } from 'tigerspend-types';

function App() {
    // eslint-disable-next-line
//    const [skey, setSkey] = useStickyState<string>('', 'skey');
    const [spendingData, setSpendingData] = useState<Transaction[]>([] as Transaction[]);
    const [ isLoading, setIsLoading ] = useState(false);

    const getSkey = () => window.localStorage.getItem('skey') ?? '';
    const setSkey = (skey: string) => window.localStorage.setItem('skey', skey)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
       syncSpendingData(); 
    }, []);

    async function validateSKey() {
        return new Promise<void>(async (resolve) => {
            const res = await fetch(`https://api.tigerwatch.app/data/${getSkey()}`);
            if (res.status === 401) {
                const socket = io('https://api.tigerwatch.app');

                socket.on('message', (msg) => {
                    window.open('https://api.tigerwatch.app/' + msg);
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
        setIsLoading(true);
        await validateSKey();
        const res = await fetch(`https://api.tigerwatch.app/data/${getSkey()}`);
        if (res.status === 401) {
            throw Error(
                'skey should have been validated but server returned 401\n' +
                'skey: ' +
                getSkey() +
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
            setIsLoading(false);
        }
    }

    return (
        <div className="App">
            <TigerwatchAppBar handleRefresh={syncSpendingData}/>
            <Hero 
                title={spendingData.length === 0 ? '' : '$' + spendingData[0].balance.toString() + ' left' }
            />
            <TransactionTable data={spendingData} isLoading={isLoading}/>
        </div>
    );
}

export default App;
