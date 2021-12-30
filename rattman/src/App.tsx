import './App.css';
import { useMediaQuery, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import ReactGA from 'react-ga';

import TigerwatchAppBar from './components/TigerwatchAppBar';
import TransactionPage from './pages/TransactionPage';
import SpendCardPage from './pages/SpendCardPage';

import syncSpendingData from './util/spending';

import type { Transaction } from 'tigerspend-types';

ReactGA.initialize("UA-216007517-1");

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useMemo(
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
