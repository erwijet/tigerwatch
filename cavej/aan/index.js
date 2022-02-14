
const { AccountCode } = require('@tigerwatch/acct');

function encodeAAN(accts) {
    if (accts.includes(AccountCode.ACCT_VIRTUAL_SUM))
        return AccountCode.ACCT_VIRTUAL_SUM;

    let aan = 0;

    for (let acct of accts) {
        aan |= (1 << acct);
    }

    return aan;
}

function decodeAAN(aan) {
    let accts = [];

    for (let acct of Object.values(AccountCode)) {
        if (aan & (1 << acct)) {
            accts.push(acct);
            aan &= ~(a << acct);
        }
    }

    return accts;
}

module.exports = { encodeAAN, decodeAAN };
