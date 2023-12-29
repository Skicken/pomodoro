import { IsNumber, IsNumberString } from 'class-validator';

export class FilterByUserID {
  @IsNumber()
  userID: number;
}
