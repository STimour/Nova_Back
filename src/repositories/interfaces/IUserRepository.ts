import { User } from '../../models/User.model';

export interface IUserRepository {

    update(id: number, deleted: boolean): Promise<User>;

    delete(id: number): Promise<void>;

    findById(id: number): Promise<User | null>;

    findAll(): Promise<User[]>;

}