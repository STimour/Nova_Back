import { User } from "../models/User.model";
import { IUserRepository } from "./interfaces/IUserRepository";

export class UserRepository implements IUserRepository {
    
    async findAll(): Promise<User[]> {
        return User.findAll();
    }

    async create(user: User): Promise<User> {
        return user.save();
    }
    async findById(id: number): Promise<User | null> {
        return User.findByPk(id);
    }

    async update(user: User): Promise<User> {
        return user.save();
    }

    async delete(user: User): Promise<void> {
        await user.destroy();
    }
}