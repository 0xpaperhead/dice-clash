import 'server-only';
import { createClient, RedisClientType } from "redis"

export class RedisClient {
    private client: RedisClientType;
    private isConnected: boolean = false;
    private connectionPromise: Promise<this> | null = null;

    constructor(redisUrl: string) {
        this.client = createClient({ url: redisUrl });
    }

    /**
     * Ensures a connection to Redis exists before performing operations
     */
    private async ensureConnection() {
        if (this.isConnected) return;
        
        if (!this.connectionPromise) {
            this.connectionPromise = this.connect();
        }
        
        await this.connectionPromise;
    }

    /**
     * Connect to Redis server
     */
    async connect() {
        if (!this.isConnected) {
            await this.client.connect();
            this.isConnected = true;
        }
        return this;
    }

    /**
     * Set a key-value pair
     */
    async set(key: string, value: string, expireSeconds?: number) {
        await this.ensureConnection();
        const options = expireSeconds ? { EX: expireSeconds } : undefined;
        return await this.client.set(key, value, options);
    }

    /**
     * Get a value by key
     */
    async get(key: string) {
        await this.ensureConnection();
        return await this.client.get(key);
    }

    /**
     * Delete a key
     */
    async del(key: string) {
        await this.ensureConnection();
        return await this.client.del(key);
    }

    /**
     * Check if a key exists
     */
    async exists(key: string) {
        await this.ensureConnection();
        return await this.client.exists(key);
    }

    /**
     * Set expiration time for a key
     */
    async expire(key: string, seconds: number) {
        await this.ensureConnection();
        return await this.client.expire(key, seconds);
    }

    /**
     * Increment a numeric value
     */
    async incr(key: string) {
        await this.ensureConnection();
        return await this.client.incr(key);
    }

    /**
     * Close the client connection
     */
    async close() {
        if (this.isConnected) {
            await this.client.disconnect();
            this.isConnected = false;
            this.connectionPromise = null;
        }
    }
}
