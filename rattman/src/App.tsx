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

import { refreshData, getChunk } from './util/spending';

import type { Transaction } from '@tigerwatch/types';

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
    const [ noMoreChunks, setNoMoreChunks ] = useState(false);
    const [chunkIndex, setChunkIndex] = useState(1);

    function handleRefresh() {
        refreshData(setIsLoading);
    }

    function nextChunk() {
        if (noMoreChunks) {
            return;
        }

        setChunkIndex((n) => {
            return ++n;
        });

        getChunk(
            chunkIndex,
            Cookies.get('skey') ?? '',
            setSpendingData,
            setNoMoreChunks,
            setIsLoading
        );
    }

    useEffect(() => {
        nextChunk(); // load first chunk
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
                                    {...{ isLoading, spendingData, nextChunk }}
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
