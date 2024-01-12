import { SettingValue } from '@prisma/client';
import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
export const createApp=(moduleRef):INestApplication=>{
  const app:INestApplication = moduleRef.createNestApplication();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    })
  );
  return app;
}


export const hasDuplicateSetting=(settings:SettingValue[])=>
{
  const uniqueValues = new Set(settings.map(v => v.settingNameID));
  return uniqueValues.size<settings.length;
}

