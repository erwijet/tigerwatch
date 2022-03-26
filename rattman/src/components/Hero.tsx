import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

import { formatBalance } from '../util/format';

type HeroProps = {
    balance: number;
    acctName: string;
    isLoading: boolean;
};


const Hero = (props: HeroProps) => {
    return props.isLoading ? (
        <></>
    ) : (
        <motion.div animate={{ y: 0 }} initial={{ y: 200 }} transition={{ type: 'spring' }}>
            <Paper style={{ margin: '5% 10%', padding: '5%' }} elevation={6}>
                <Typography variant="h2" component="h2">
                    {formatBalance(props.balance)}
                </Typography>
                <Typography variant="h6" component="h6">
                    {props.acctName}
                </Typography>
            </Paper>
        </motion.div>
    );
};

export default Hero;
