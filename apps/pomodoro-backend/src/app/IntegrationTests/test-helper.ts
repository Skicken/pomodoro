import { JwtService } from '@nestjs/jwt';
import { SettingValue, UserType } from '@prisma/client';
import { INestApplication, ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { AuthUserDTO } from '../Modules/auth/DTO/auth-user-dto';
import { TokenPayload } from '../Modules/auth/Services/authenticate.service';
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
export const CreateNormalUser=(jwt:JwtService):AuthUserDTO=>{
  const user:AuthUserDTO = {
    access_token: jwt.sign(<TokenPayload>{ sub: 1, role: UserType.USER }),
    refresh_token: '',
    id: 1,
    createdAt: undefined,
    userType: 'USER',
    nickname: 'Johnny',
    email: 'johnny@email.com',
    password: '123'
  }
  return user;
}
export const CreateAdminUser=(jwt:JwtService):AuthUserDTO=>{
  const user:AuthUserDTO = {
    access_token: jwt.sign(<TokenPayload>{ sub: 1, role: UserType.ADMIN }),
    refresh_token: '',
    id: 1,
    createdAt: undefined,
    userType: 'USER',
    nickname: 'Johnny',
    email: 'johnny@email.com',
    password: '123'
  }
  return user;
}


