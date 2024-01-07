import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
export const createApp=(moduleRef):INestApplication=>{
  const app = moduleRef.createNestApplication();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    })
  );
  app.useLogger(new Logger());

  return app;
}
