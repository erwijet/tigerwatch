import { CircularProgress } from '@mui/material';

const Spinner = () => (
    <div
        style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
        }}
    >
        <CircularProgress />
    </div>
);

export default Spinner;