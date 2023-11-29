import { IsString, Length } from "class-validator";

export class RegisterUserDto {
	@IsString()
  @Length(4, 20)
	login: string;

	@IsString()
  @Length(6, 20)
	password: string;
}