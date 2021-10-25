import './App.css';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import io from 'socket.io-client';

function App() {
  const [ skey, setSkey ] = useState(null);
  let token = '';

  async function fetchSpendingData(): Promise<string> {
    const res = await fetch(`https://tigerspend.rit.edu/statementdetail.php?cid=105&skey=${skey}format=csv&startdate=2021-04-01&enddate=2021-10-30&acct=4`);
    return ''; 
  }

  function launchShib(): void {
    window.open('https://tigerspend-shib.herokuapp.com/' + token);
  }
  
  return (
    <div className="App">
      <Button variant="contained" onClick={fetchSpendingData}>{process.env.REACT_APP_TEST}</Button> 
    </div>
  );
}

export default App;
