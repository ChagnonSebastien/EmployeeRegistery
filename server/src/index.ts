import { Response, Request, NextFunction, Express } from 'express';
import { readFileSync } from 'fs';
import { json } from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as cors from 'cors';

import { Database } from './database';

const port = 5000;

Database.getInstance().then(database => {
    if (database.connection) {
        startServer(process.argv.slice(2)[0] == 'https');
    } else {
        console.log('Error while starting the server. Exiting now.');
    }
})

function startServer(isHttps: boolean): https.Server | http.Server {
    const app = express();
    config(app);
    routes(app);

    let server: https.Server | http.Server;
    if (isHttps) {
        const options = {
            key: readFileSync('/etc/letsencrypt/live/poutineqc.ca/privkey.pem'),
            cert: readFileSync('/etc/letsencrypt/live/poutineqc.ca/fullchain.pem')
        };
    
        server = https.createServer(options, app).listen(port);
    } else {
        server = http.createServer(app).listen(port);
    }

    console.log(`Server started on port: ${port}`);
    return server;
}

function config(app: Express): void {
    app.use(cors());
    app.use(json());
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`${Date.now()}- ${req.method} request from ${req.connection.remoteAddress} at ${req.originalUrl}`);
        next();
    });
}

function routes(app: Express): void {
}