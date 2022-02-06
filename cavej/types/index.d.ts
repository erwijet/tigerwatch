declare module '@tigerwatch/types' {
    /*
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
     * Describes a (parsed) transaction
     *
     * For unparsed transactions (directly from API), refer to {@see RawTransaction}.
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

    /**
     * represents an unparsed {@see Transaction}, where each attribute is still a string
     */
    type RawTransaction = {
        /**
         * The date (currently not time) a transaction occured
         */
        date: string;
        /**
         * The location of the transaction
         */
        location: TransactionLocation;
        /**
         * The change to the balance the transaction imposed (this is always negative since deposits are excluded)
         */
        amount: string;
        /**
         * The resulting balance of the account, *after* the transaction
         */
        balance: string;
        /**
         * The corresponding account code for the transaction
         */
        acct: string;
    };
}
