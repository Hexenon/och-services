import "dotenv/config";

class Config {
  get DevMode() {
    return this.getEnv("NODE_ENV") !== "production";
  }

  get mongoUrl() {
    return this.getEnv("MONGO_URL");
  }

  get redisUrl() {
    return this.getEnv("REDIS_URL");
  }

  get port() {
    return this.getEnv("PORT");
  }

  get appKey() {
    return this.getEnv("APP_KEY");
  }

  getEnv(key: string) {
    if (!process.env[key]) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return process.env[key];
  }
}

export const config = new Config();
