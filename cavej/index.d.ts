declare module 'tigerspend-types' {
    /**
     * Describes a place on campus a transaction could occur
     */
    type TransactionLocation = {
        /**
         * The unique name of the location
         */
        name: string;
        /**
         * the category location
         */
        category: string;
        /**
         * the font-awesome icon associated with the location
         */
        icon: string;
    };

    /**
     * Describes a transaction
     */
    type Transaction = {
        /**
         * The date (currently not time) a transaction occured
         */
        date: Date;
        /**
         * The location of the transaction
         */
        location: TransactionLocation;
        /**
         * The change to the balance the transaction imposed (this is always negative since deposits are excluded)
         */
        amount: number;
        /**
         * The resulting balance of the account, *after* the transaction
         */
        balance: number;
        /**
         * The corresponding account code for the transaction
         */
        acct: number;
    };

    enum AccountCode {
        ACCT_VIRTUAL_SUM = -1,
        TIGER_BUCKS = 1,
        STANDARD_DINING_DOLLARS = 4,
        VOLUNTARY_DINING_DOLLARS = 24,
        ROLLOVER_DINING_DOLLARS = 29,
    }
}
