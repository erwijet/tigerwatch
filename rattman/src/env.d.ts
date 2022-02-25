/// <reference types='vite/client' />

interface ImportMetaEnv {
    readonly VITE_AUTH_ROUTE: string;
    readonly VITE_DATA_AAN_ROUTE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
