import './App.css';
import { useState } from 'react';
import { alertTitleClasses, Button } from '@mui/material';
import io from 'socket.io-client';
import useStickyState from './useStickyState';
import TigerwatchAppBar from './components/TigerwatchAppBar';

function App() {
  // eslint-disable-next-line
  const [ skey, setSkey ] = useStickyState<string>('', 'skey');
  const [ spendingData, setSpendingData ] = useState([]);
  
  async function syncSpendingData() {
      const res = await fetch(`https://vps.erwijet.com/data/${skey}`);
      if (res.status === 401) {
        const socket = io('https://vps.erwijet.com');

        socket.on('message', (msg) => {
          window.open('https://vps.erwijet.com/' + msg);
        });

        socket.on('skey', async ({ skey }) => {
          setSkey(skey);
          alert(skey);
          syncSpendingData();
        });
      } else {
        setSpendingData(await res.json());
      }
  }
  
  return (
    <div className="App">
        <TigerwatchAppBar />
        <Button variant="outlined" onClick={syncSpendingData}>Sync Spending Data</Button>
        <p>{ JSON.stringify(spendingData) }</p>
    </div>
  );
}

export default App;
