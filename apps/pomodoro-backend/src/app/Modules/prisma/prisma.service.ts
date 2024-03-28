import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { exit } from 'process';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {



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
