import { Handler } from '@netlify/functions';

const handler: Handler = async (evt, ctx) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ msg: 'your logs...' }),
    };
};

export { handler };
