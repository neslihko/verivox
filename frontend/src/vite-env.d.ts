/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_USER_ACCOUNT_BACKEND_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
