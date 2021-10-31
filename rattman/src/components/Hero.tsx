import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const Hero = (props: { title: string }) => {
    return (
        <Paper
            style={{ margin: "5% 10%", padding: '5%'}} 
            elevation={6}
        >
            <Typography variant="h2" component="h2">{props.title}</Typography>
        </Paper>
    )
}

export default Hero;