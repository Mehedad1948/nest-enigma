import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

// 🚀🚀 Since Params are being get as object the validation should be done by class validator like this
// 🚀🚀 Queries on the other side always are being get as string so the can be validated in pipeline
export class GetUsersParamDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
