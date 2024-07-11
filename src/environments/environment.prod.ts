declare const process: {env: {API_URL: string}};

export const environment = {
    production: true,
    apiUrl: process.env["API_URL"]
    //apiUrl: 'http://127.0.0.1:8000'
};
