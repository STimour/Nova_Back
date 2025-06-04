import { User } from '../../models/User.model';

export interface IUserRepository {

    update(user: User): Promise<User>;

    delete(user: User): Promise<void>;

    findById(id: number): Promise<User | null>;

    findAll(): Promise<User[]>;

}