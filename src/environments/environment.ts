declare const process: {env: {API_URL: string}};

export const environment = {
    production: false,
    apiUrl: process.env.API_URL
};
