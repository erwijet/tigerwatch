import { Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import TigerwatchNavBar from '../components/TigerwatchNavBar';
import Spinner from '../components/Spinner';

import ReactGA from 'react-ga';

function SpendCardPage() {
    // if skey is truly nil/invalid, user will be authed from app.tsx logic before this
    // page is rendered. This means that skey *should never* be "nil", but we safeguard here just in case
    const skey = Cookies.get('skey') || 'nil';

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        ReactGA.pageview(window.location.href);
    // eslint-disable-nextline
    }, []);

    return (
        <>
            {!isLoaded && <Spinner />}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '90vh',
                }}
            >
                <Paper
                    elevation={4}
                    sx={{ m: 2, p: 2, display: isLoaded ? 'block' : 'none' }}
                >
                    <img
                        style={{ width: '85vw' }}
                        src={`https://tigerspend.rit.edu/imagestudentcard.php?cid=105&skey=${skey}&side=front`}
                        alt={'spending card'}
                        onLoad={() => {
                            console.log('loaded!');
                            setIsLoaded(true);
                        }}
                    />
                </Paper>
            </div>
            <TigerwatchNavBar />
        </>
    );
}
export default SpendCardPage;
