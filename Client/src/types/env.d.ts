declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_CLIENT_NAME?: string; // Optional due to fallback
    NODE_ENV: string;
    PUBLIC_URL: string;
    // Add other env variables as needed
  }
}