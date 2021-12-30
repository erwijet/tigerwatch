import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Slide } from 'react-reveal';

type HeroProps = {
    balance: number;
    acctName: string;
    isLoading: boolean;
};

/**
 * Formats `balance` to a traditional currency format
 *  
 * @param balance the balance to format
 * @returns the formated balance
 */
function formatBalance(balance: number): string {
    return `$${balance.toFixed(2).toString()}`;
}

const Hero = (props: HeroProps) => {
    return props.isLoading ? (
        <></>
    ) : (
        <Slide bottom>
            <Paper style={{ margin: '5% 10%', padding: '5%' }} elevation={6}>
                <Typography variant="h2" component="h2">
                    {formatBalance(props.balance)}
                </Typography>
                <Typography variant="h6" component="h6">
                    {props.acctName}
                </Typography>
            </Paper>
        </Slide>
    );
};

export default Hero;
