import { BehaviorSubject } from 'rxjs';
import { Db, MongoClient, MongoError } from 'mongodb';
import * as CONFIG from './config';

export class Database {
    private static instance: Database;
    private connection$: Db;
    public connected: BehaviorSubject<boolean>;

    private constructor() {
        this.connected = new BehaviorSubject<boolean>(false);
    }

    public static async getInstance(): Promise<Database> {
        if (Database.instance === undefined) {
            Database.instance = new Database();
            await Database.instance.connectToDatabase()
            .then(() => {
                console.log('MongoDB connected...');
            })
            .catch((reason: any) => {
                console.error(`Error while connecting to the database: ${reason}`);
            });
        }
        return Database.instance;
    }

    public get connection(): Db {
        return this.connection$;
    }

    private connectToDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(`mongodb://${CONFIG.DATABASE_USER}:${CONFIG.DATABASE_PASSWORD}@${CONFIG.DATABASE_URL}:${CONFIG.DATABASE_PORT}/${CONFIG.DATABASE_DB}`, (err: MongoError, client: any) => {
                if (err) {
                    reject(err.message);
                    this.connected.next(false);
                    resolve();
                } else {
                    this.connection$ = client.db('capn');
                    this.connected.next(true);
                    resolve();
                }
            });
        });
    }
}