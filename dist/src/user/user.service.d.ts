import { Account } from '../entities/Account';
import { Repository } from 'typeorm';
import { JoinRequestDto } from './dto/join.dto';
export declare class UserService {
    private accountRepository;
    constructor(accountRepository: Repository<Account>);
    findByEmail(email: string): Promise<Account>;
    findByStudentId(student_id: number): Promise<Account>;
    join(account: JoinRequestDto): Promise<void>;
}
