import { generate } from 'randomstring';

export class KeyManager {
    public static instance: KeyManager;
    private key: string;

    private constructor() {
        this.key = generate();
    }

    public getKey(): string {
        return this.key;
    }

    public static generateKey() {
        KeyManager.instance = new KeyManager;
    }
}