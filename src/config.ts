import "dotenv/config";

class Config {
  get DevMode(): boolean {
    return this.getEnv("NODE_ENV") === "test";
  }

  get StagingMode(): boolean {
    return this.getEnv("NODE_ENV") === "staging";
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

  get fromEmail(): string {
    return this.getEnv("FROM_EMAIL");
  }

  get emailSender(): {
    username: string;
    password: string;
    host: string;
    port: number;
  } {
    return {
      username: this.getEnv("EMAIL_USERNAME"),
      password: this.getEnv("EMAIL_PASSWORD"),
      host: this.getEnv("SMTP_HOSTNAME"),
      port: Number(this.getEnv("SMTP_PORT")),
    };
  }

  get signMessage(): string {
    return this.getEnv("SIGN_MESSAGE");
  }

  getEnv(key: string) {
    if (!process.env[key]) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return process.env[key];
  }
}

export const config = new Config();
