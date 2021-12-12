import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link } from 'react-router-dom';

import type { ReactElement } from 'react';

import {
    Home as HomeIcon,
    BarChart as BarChartIcon,
    CreditScore as CreditScoreIcon
} from '@mui/icons-material';

type NavAction = {
    icon: ReactElement<any, any>,
    name: string,
    path: string
}

function Nav({ actions }: { actions: NavAction[] }) {

    const handleChange = (idx: number) => {
        window.location.href = actions[idx].path; 
    }

    return (
        <BottomNavigation
            className={'navbar'}
            showLabels
            value={window.location.href}
            onChange={(_, newValue) => {
                handleChange(newValue);
            }}
        >
            { actions.map(action => {
                return (
                    <BottomNavigationAction
                        component={Link}
                        to={action.path}
                        label={action.name}
                        icon={action.icon}
                    />
                )
            })}
        </BottomNavigation>
    );
}

function TigerwatchNavBar() {
    return (
        <Nav actions={[
            {
                path: '/',
                name: 'Home',
                icon: <HomeIcon /> 
            },
            {
                path: '/graph',
                name: 'Graph',
                icon: <BarChartIcon />
            },
            {
                path: '/spendcard',
                name: 'Card',
                icon: <CreditScoreIcon />
            }
        ]}/>
    )
}

export default TigerwatchNavBar;
