import axios from 'axios';
import locations from './locations.json';
import type { Transaction, TransactionLocation } from 'tigerspend-types';
import type { RequestHandler } from 'express';

/**
 * Pad a number, n, with prefixed 0's so that its length is >= 2
 *
 * @param n The number to pad
 * @returns The padded number as string
 */
const padNum = (n: number) => {
    let s = n.toString();
    for (let i = 0; i < 2 - n.toString().length; i++) {
        s = '0' + s;
    }
    return s;
};

/**
 * Format a date in the format of yyyy-mm-dd
 *
 * @param date The date in question
 */
function dateToString(date: Date): string {
    return `${
        date.getFullYear() +
        '-' +
        padNum(date.getMonth() + 1) +
        '-' +
        padNum(date.getDate())
    }`;
}

/**
 * Looks through locations.json and matches a string, str, to the regular
 * expressions specified at locations[i]::regex to find the corresponding location
 *
 * @param str the description
 * @returns If a location was found, the location. Else, undefined
 */
function lookupTransactionLocationByDescriptionStr(
    str: string
): TransactionLocation | undefined {
    for (let location of locations) {
        if (str.match(location.regex)) {
            const { name, icon, category } = location;
            return { name, icon, category };
        }
    }
}

/**
 * Parse the CSV returned from tigerspend.rit.edu into a JSON array
 *
 * @param csv The array of strings to parse
 * @returns An array of transactions; the parsed data
 */
function parseCSV(csv: string[]): Transaction[] {
    const headerRow = csv.shift();
    const headers = headerRow?.split(',') ?? [];

    const VALID_HEADERS = ['date', 'description', 'amount', 'balance'];
    if (
        headers
            .map((e) => e.toLowerCase())
            .filter((e) => VALID_HEADERS.includes(e)).length !=
        VALID_HEADERS.length
    )
        throw 'invalid header';

    const arr: Transaction[] = [];

    for (let line of csv) {
        const [date, description, amount, balance] = line.split(',');
        if (typeof description != 'string') continue;
        const location = lookupTransactionLocationByDescriptionStr(description);

        if (!location) continue; // exclude admin tasks, deposits, etc...

        arr.push({
            amount: parseFloat(amount),
            balance: parseFloat(balance),
            date: new Date(date.replace('AM', ' AM').replace('PM', ' PM')),
            location,
        });
    }

    return arr;
}

/**
 * Request data from tigerspend.rit.edu and authenticate by skey, which should be
 * specified in the req.params incoming object.
 *
 * @param req The incoming Express request
 * @param res The outbound Express response
 * @returns null
 */
const tigerspendRequestHandler: RequestHandler = async (req, res) => {
    const startDate = new Date();
    const endDate = new Date();
    const { skey } = req.params;
    const DINING_DOLLARS_ACCT_CODE = 4; // account code for dining dollars (this isnt intellij-- we dont condone magic numbers lol)

    startDate.setMonth(endDate.getMonth() - 6);

    const tigerspendRes = await axios.get(
        `https://tigerspend.rit.edu/statementdetail.php?cid=105&skey=${skey}&startdate=${dateToString(
            startDate
        )}&enddate=${dateToString(
            endDate
        )}&acct=${DINING_DOLLARS_ACCT_CODE}&format=csv`
    );

    if (tigerspendRes.headers['x-server']?.includes('shib')) {
        // x-server header is set to shib2.rit.edu when it redirects to shib auth
        // if it redirects us, it means it didn't approve our skey (it's expired/invalid). We handle this here

        return res.status(401).json({
            msg: 'unauthorized skey value',
        });
    }

    const csvData: string = tigerspendRes.data as string;
    return res.json(parseCSV(csvData.split('\n')));
};

export default tigerspendRequestHandler;
