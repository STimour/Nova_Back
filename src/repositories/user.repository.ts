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

    async update(id: number, deleted: boolean): Promise<User> {
        const user = await this.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        user.deleted = deleted;
        await user.save();
        return user;
    }

    async delete(id: number): Promise<void> {
        
        const user = await this.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        await user.destroy();
    }
}

//TODO Finir les dispatch 