import { Redis } from "@upstash/redis";
import { createClient } from "redis";

// Check if we're using local Redis or Upstash
const isLocalRedis = process.env.REDIS_URL?.startsWith("redis://");

// Initialize Redis client based on environment
let redisClient: any;

if (isLocalRedis) {
  // Use local Redis client for development
  redisClient = createClient({
    url: process.env.REDIS_URL!,
  });

  // Connect to local Redis
  redisClient.connect().catch(console.error);
} else {
  // Use Upstash Redis for production
  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  });
}

// Create a unified Redis interface
export const redis = {
  async get<T>(key: string): Promise<T | null> {
    if (isLocalRedis) {
      const result = await redisClient.get(key);
      return result ? JSON.parse(result) : null;
    } else {
      return (await redisClient.get(key)) as T | null;
    }
  },

  async setex(key: string, ttl: number, value: any): Promise<void> {
    if (isLocalRedis) {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    } else {
      await redisClient.setex(key, ttl, value);
    }
  },

  async del(...keys: string[]): Promise<void> {
    if (isLocalRedis) {
      await redisClient.del(keys);
    } else {
      await redisClient.del(...keys);
    }
  },

  async keys(pattern: string): Promise<string[]> {
    if (isLocalRedis) {
      return await redisClient.keys(pattern);
    } else {
      return await redisClient.keys(pattern);
    }
  },

  async flushdb(): Promise<void> {
    if (isLocalRedis) {
      await redisClient.flushDb();
    } else {
      await redisClient.flushdb();
    }
  },
};

// Check if Redis is configured
export const isRedisConfigured = () => {
  return !!(
    process.env.REDIS_URL ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );
};

// Cache key prefixes for organization
export const CACHE_KEYS = {
  USER: (id: number) => `user:${id}`,
  USER_WITH_TEAM: (id: number) => `user_team:${id}`,
  TEAM_MEMBERS: (teamId: number) => `team_members:${teamId}`,
  CUSTOMER_BY_ID: (id: number) => `customer:${id}`,
  CUSTOMERS: (teamId: number, page: number, pageSize: number) =>
    `customers:${teamId}:${page}:${pageSize}`,
  CUSTOMERS_COUNT: (teamId: number) => `customers_count:${teamId}`,
  STAFF: (teamId: number, page: number, pageSize: number) =>
    `staff:${teamId}:${page}:${pageSize}`,
  STAFF_COUNT: (teamId: number) => `staff_count:${teamId}`,
  BOOKINGS: (page: number, pageSize: number) => `bookings:${page}:${pageSize}`,
  BOOKINGS_COUNT: () => `bookings_count`,
  SERVICE_RECORDS: (customerId: number) => `service_records:${customerId}`,
  ACTIVITY_LOGS: (userId: number) => `activity_logs:${userId}`,
};

// Default TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 60, // 1 minute - for frequently changing data
  MEDIUM: 300, // 5 minutes - for semi-static data
  LONG: 3600, // 1 hour - for rarely changing data
  USER_SESSION: 1800, // 30 minutes - for user session data
};
