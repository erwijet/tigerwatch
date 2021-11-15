import './App.css';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import TigerwatchAppBar from './components/TigerwatchAppBar';
import TransactionTable from './components/TransactionTable';
import Hero from './components/Hero';
import { Transaction, TransactionLocation } from 'tigerspend-types';

function App() {
    const [spendingData, setSpendingData] = useState<Transaction[]>(
        [] as Transaction[]
    );
    const [isLoading, setIsLoading] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        syncSpendingData();
    }, []);

    async function syncSpendingData() {
        setIsLoading(true);
        console.log(Cookies.get('skey'));
        const res = await fetch(`https://api.tigerwatch.app/data/${Cookies.get('skey')}`);

        if (res.status === 401) {
            // redirect user to shib login
            window.location.href = 'https://tigerspend.rit.edu/login.php?wason=https://api.tigerwatch.app/callback'
            setIsLoading(false);
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
            <TigerwatchAppBar handleRefresh={syncSpendingData} />
            <Hero
                title={
                    spendingData.length === 0
                        ? ''
                        : '$' + spendingData[0].balance.toString() + ' left'
                }
            />
            <TransactionTable data={spendingData} isLoading={isLoading} />
        </div>
    );
}

export default App;
