import './styles.css';

import { useToast, Badge, ChakraProvider, Button } from '@chakra-ui/react';

async function getLogs() {
    return [];
}

function CarolineRedeployButton() {
    const toast = useToast();
    getLogs().then(console.log);
    return (
        <Button
            sx={{ m: 2 }}
            onClick={async () => {
                toast({
                    title: 'API Redeploy Started',
                    description: 'Caroline server restart is working...',
                    status: 'info',
                    duration: 9000,
                    isClosable: true,
                });
            }}
        >
            <span>Redeploy</span>
            <Badge sx={{ ml: 3 }} colorScheme="purple">
                API
            </Badge>
        </Button>
    );
}

function CarolineRepullButton() {
    const toast = useToast();
    return (
        <Button
            onClick={() => {
                toast({
                    title: 'API Redeploy Started',
                    description: 'Caroline server restart is working...',
                    status: 'info',
                    duration: 9000,
                    isClosable: true,
                });
                toast({
                    title: 'API Redeploy Success',
                    description: 'Caroline server restarted sucessfully',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }}
        >
            <span>Pull from Github</span>
            <Badge sx={{ ml: 3 }} colorScheme="purple">
                API
            </Badge>
        </Button>
    );
}

function RattmanDeployButton() {
    const toast = useToast();
    return (
        <Button
            sx={{ m: 3 }}
            onClick={() => {
                toast({
                    title: 'Client Redeploy Started',
                    description: 'Rattman client restart is working...',
                    status: 'info',
                    duration: 9000,
                    isClosable: true,
                });
                toast({
                    title: 'Client Redeploy Success',
                    description: 'Rattman client restarted sucessfully',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }}
        >
            <span>Netlify Rebuild</span>
            <Badge sx={{ ml: 3 }} colorScheme="messenger">
                Client
            </Badge>
        </Button>
    );
}

export default function App() {
    return (
        <ChakraProvider>
            <div className="App">
                <Button colorScheme="blue">Button</Button>
            </div>

            <CarolineRedeployButton />
            <CarolineRepullButton />
            <RattmanDeployButton />
            <br />
            <iframe width='100vw' src="https://api.tigerwatch.app:5689"></iframe>
        </ChakraProvider>
    );
}
