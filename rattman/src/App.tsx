import './App.css';
import React from 'react';
import { useMediaQuery, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';

import TigerwatchAppBar from './components/TigerwatchAppBar';
import TransactionPage from './pages/TransactionPage';
import SpendCardPage from './pages/SpendCardPage';

import syncSpendingData from './util/spending';

import type { Transaction } from 'tigerspend-types';

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode]
    );

    const [spendingData, setSpendingData] = useState<Transaction[]>(
        [] as Transaction[]
    );
    const [isLoading, setIsLoading] = useState(true);

    function handleRefresh() {
        syncSpendingData(
            Cookies.get('skey') ?? '',
            setIsLoading,
            setSpendingData
        );
    }

    useEffect(() => {
        console.log('current spending data...', { spendingData });
        handleRefresh();
    // eslint-disable-next-line 
    }, []);

    return (
        <ThemeProvider theme={theme}>
            {/* include cssbaseline to make background comply with theming */}
            <CssBaseline />
            <div className="App">
                <TigerwatchAppBar handleRefresh={handleRefresh} />
                <BrowserRouter>
                    <Routes>
                        <Route
                            element={
                                <TransactionPage
                                    {...{ isLoading, spendingData }}
                                />
                            }
                            path="/"
                        />
                        <Route element={<SpendCardPage />} path="/spendcard" />
                    </Routes>
                </BrowserRouter>
            </div>
        </ThemeProvider>
    );
}

export default App;
