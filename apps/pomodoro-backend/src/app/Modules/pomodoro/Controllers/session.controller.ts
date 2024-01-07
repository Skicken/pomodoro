import { ExtractPayload, checkOwnerThrow } from '../../auth/Guards/extract-payload.decorator';
import { TokenPayload } from '../../auth/Services/authenticate.service';
import { AddSessionDTO } from '../Dto/add-session-dto';
import { SessionFilter } from '../Filters/SessionFilter';
import { SettingValueFilter } from '../Filters/SettingValueFilter';
import { SessionService } from './../Services/Session/session.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

@Controller('session')
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
    checkOwnerThrow(dto.userID,payload)
    return this.sessionService.AddSession(dto)
  }


}
