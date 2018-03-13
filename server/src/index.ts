import { Response, Request, NextFunction, Express } from 'express';
import { readFileSync } from 'fs';
import { json } from 'body-parser';
/* import {hash} from 'bcrypt'; */
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as cors from 'cors';

import { Database } from './database';
import { KeyManager } from './keyManager';
import { tokenVerify } from './middleware/tockenVerify';
import { DATABASE_URL, SERVER_PORT } from './config';

Database.getInstance().then(database => {
    if (database.connection) {

        /* hash('password', 10).then(function(hash) {
            database.connection.collection('users').insertOne({_id: 'chagnon.s21@gmail.com', password: hash});
        }); */

        KeyManager.generateKey();
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
            key: readFileSync(`/etc/letsencrypt/live/${DATABASE_URL}/privkey.pem`),
            cert: readFileSync(`/etc/letsencrypt/live/${DATABASE_URL}/fullchain.pem`)
        };
    
        server = https.createServer(options, app).listen(SERVER_PORT);
    } else {
        server = http.createServer(app).listen(SERVER_PORT);
    }

    console.log(`Server started on port: ${SERVER_PORT}`);
    return server;
}

function config(app: Express): void {
    app.use(cors());
    app.use(json());
    
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`${Date.now()}- ${req.method} request from ${req.connection.remoteAddress} at ${req.originalUrl}`);
        next();
    });

    const login = require('./routers/login');
    app.use('/login', login);
    app.use(tokenVerify);
}

function routes(app: Express): void {
    const employees = require('./routers/employees');
    app.use('/employees', employees);
    const employeeTypes = require('./routers/employeetypes');
    app.use('/employeetypes', employeeTypes);
}