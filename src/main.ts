import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "./config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(config.port);
}
bootstrap();
