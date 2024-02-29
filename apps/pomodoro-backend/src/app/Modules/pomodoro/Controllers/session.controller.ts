import { ExtractPayload, checkOwnerThrow } from '../../auth/Guards/extract-payload.decorator';
import { TokenPayload } from '../../auth/Services/authenticate.service';
import { JwtAuthGuard } from '../../auth/Services/jwt-strategy.service';
import { AddSessionDTO } from '../Dto/session/add-session-dto';
import { SessionFilter } from '../Filters/SessionFilter';
import { SessionService } from './../Services/Session/session.service';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

@Controller('session')
@UseGuards(JwtAuthGuard)
export class SessionController {

  constructor(private sessionService:SessionService){}

  @Get()
  async GetSessionFilter(
    @Query() filter: SessionFilter,
    @ExtractPayload() payload: TokenPayload
  ) {
      checkOwnerThrow(filter.userID,payload)
      return this.sessionService.GetFiltered(filter)
  }
  @Post()
  async AddSession(
    @Body() dto:AddSessionDTO,
    @ExtractPayload() payload: TokenPayload
  ) {
    return this.sessionService.AddSession(payload.sub,dto)
  }


}
