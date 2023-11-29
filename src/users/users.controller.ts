import { Response } from 'express';
import { UsersService } from './usesr.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

export class UsersController {
	constructor(private usersService: UsersService) {}

	login = async ({ body }, res: Response): Promise<Response> => {
		const dto: LoginUserDto = body;
		return await this.usersService.login(dto, res);
	}

	register = async ({ body }, res: Response): Promise<Response> => {
		const dto: RegisterUserDto = body;
		return await this.usersService.register(dto, res);
	}
}