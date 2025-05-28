const Config = {
    JWT_SECRET: process.env.JWT_SECRET!,

    redis: {
        url: process.env.REDIS_URL!,
    },
    privy: {
        appId: process.env.PRIVY_APP_ID!,
        appSecret: process.env.PRIVY_APP_SECRET!,
    },
    encryption: {
        salt: process.env.ENCRYPTION_SALT!,
        password: process.env.ENCRYPTION_PASSWORD!,
        rounds: parseInt(process.env.ENCRYPTION_ROUNDS!),
    }
}

export default Config
