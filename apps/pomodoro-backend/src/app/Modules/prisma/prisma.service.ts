import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { env, exit } from 'process';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {


  constructor()
  {
    let DATABASE_URL = env.DATABASE_URL_DEV;
    // if (process.env.NODE_ENV === "production") {
    //   Logger.warn("USING PRODUCTION PRISMA SETUP")
    //   DATABASE_URL = env.DATABASE_URL
    // }
    // else if (process.env.NODE_ENV == "development")
    // {
    //   Logger.warn("USING DEVELOPMENT PRISMA SETUP")
    //   DATABASE_URL = env.DATABASE_URL_DEV
    // }
    super({datasourceUrl:DATABASE_URL})
  }
  async onModuleInit() {
    try{
      await this.$connect();
    }catch(error)
    {
      if(error instanceof PrismaClientInitializationError)
      {
        Logger.error(error.message)
        exit(0)
      }
    }
  }
}
