import { UserService } from './user.service';
import { JoinRequestDto } from './dto/join.dto';
import { ResponseDTO } from './dto/responst.dto.will.delete';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    login(account: JoinRequestDto): Promise<string | ResponseDTO>;
}
