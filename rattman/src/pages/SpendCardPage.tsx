import { Paper } from '@mui/material';
import { useState } from 'react';
import Cookies from 'js-cookie';
import TigerwatchNavBar from '../components/TigerwatchNavBar';
import Spinner from '../components/Spinner';

function SpendCardPage() {
    // if skey is nil, user will be authed from app.tsx logic
    const skey = Cookies.get('skey') || 'nil';

    const [ isLoaded, setIsLoaded ] = useState(false);



    return (
        <>
            { !isLoaded && <Spinner /> }
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh'}}>
                <Paper elevation={4} sx={{m: 2, p: 2, display: isLoaded ? 'block' : 'none'}}>
                    <img 
                        style={{ width: '85vw' }}
                        src={`https://tigerspend.rit.edu/imagestudentcard.php?cid=105&skey=${skey}&side=front`} 
                        alt={"spending card"}
                        onLoad={() => {
                            console.log('loaded!');
                            setIsLoaded(true);
                        }}
                    />
                </Paper>
            </div>
            <TigerwatchNavBar />
        </>);
}
export default SpendCardPage;
