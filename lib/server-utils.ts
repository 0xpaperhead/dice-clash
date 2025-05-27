"server-only"

import Config from "@/config"

import { RedisClient } from "./redis"

const redis = new RedisClient(Config.redis.url);


export { redis }








