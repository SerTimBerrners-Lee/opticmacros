import { IsString, Length } from "class-validator";

export class LoginUserDto {
	@IsString()
  @Length(4, 20)
	login: string;
	
	@IsString()
  @Length(6, 20)
	password: string;
}