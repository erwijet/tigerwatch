import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';

import type { Transaction } from 'tigerspend-types';

import './App.css';
import TigerwatchAppBar from './components/TigerwatchAppBar';

import TransactionPage from './components/TransactionPage';
import syncSpendingData from './util/spending';

function App() {
    const [ spendingData, setSpendingData ] = useState<Transaction[]>([] as Transaction[]);
    const [ isLoading, setIsLoading ] = useState(true);

    function handleRefresh() {
        syncSpendingData(Cookies.get('skey') ?? '', setIsLoading, setSpendingData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        handleRefresh();
    }, []);

    return (
        <div className="App">
            <TigerwatchAppBar handleRefresh={handleRefresh} />
            <BrowserRouter>
                <Routes>
                    <Route element={<TransactionPage {...{isLoading, spendingData}} />} path="/" />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
