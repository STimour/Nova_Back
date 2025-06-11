import { Availability } from './../models/Availability.model';
import { Reputation } from './../models/Reputation.model';
import { IUser, UserCreationAttributes } from '../models/interfaces/IUser';
import { User } from '../models/User.model';
import logger from '../utils/logger';
import { IUserRepository } from './interfaces/IUserRepository';
import { getErrorMessage } from '../middlwares/errorHandler.middlewares';

export class UserRepository implements IUserRepository {
    private readonly USER_NOT_FOUND: boolean;

    constructor() {
        this.USER_NOT_FOUND = true;
    }

    public async findAllUsers(): Promise<User[]> {
        try {
            return await User.findAll();
        } catch (error) {
            logger.error('Error in UserRepository.findAllUsers: %s', getErrorMessage(error));
            throw error;
        }
    }

    public async findAllStudents(): Promise<User[]> {
        try {
            return await User.findAll({ where: { role: 'student' } });
        } catch (error) {
            logger.error('Error in UserRepository.findAllStudents: %s', getErrorMessage(error));
            throw error;
        }
    }

    public async findAllHelpers(): Promise<User[]> {
        try {
            return await User.findAll({
                where: { role: 'helper' },
                include: [
                    { model: Reputation, as: 'reputations' }
                ]
            });
        } catch (error) {
            logger.error('Error in UserRepository.findAllHelpers: %s', getErrorMessage(error));
            throw error;
        }
    }

    public async isUserExists(
        email: string,
        firstname: string,
        deleted: boolean = false
    ): Promise<boolean> {
        try {
            const user = await User.findOne({
                where: { email: email, firstname: firstname, deleted }
            });

            if (user !== null) return !this;

            return false;
        } catch (error) {
            logger.error(
                'Error in UserRepository.verifyUserBeforeInscription for %s %s: %s',
                firstname,
                email,
                getErrorMessage(error)
            );
            throw error;
        }
    }

    public async createUser(user: IUser): Promise<boolean> {
        try {
            const newUser = await User.create(user as UserCreationAttributes);

            if (!newUser) {
                logger.warn(
                    'UserRepository.createUser: Failed to create user %s %s',
                    user.firstname,
                    user.lastname
                );
                return false;
            }

            return true;
        } catch (error) {
            logger.error(
                'Error in UserRepository.createUser for %s %s: %s',
                user.firstname,
                user.lastname,
                getErrorMessage(error)
            );
            throw error;
        }
    }

    public async findHelper(id: number): Promise<User | undefined> {
        try {
            const helper = await User.findOne({
                where: { id: id, role: 'helper' },
                include: [
                    { model: Reputation, as: 'reputations' },
                    { model: Availability, as: 'availabilities' }
                ]
            });

            if (helper === null) {
                logger.error("Helper for id %d: %s wasn't found", id);
                return undefined;
            }
            return helper;
        } catch (error) {
            logger.error(
                'Error in UserRepository.findById for id %d: %s',
                id,
                getErrorMessage(error)
            );
            throw error;
        }
    }

    public async findStudent(id: number): Promise<User | undefined> {
        try {
            const student = await User.findOne({ where: { id: id, role: 'student' } });
            if (student === null) {
                logger.error("Student for id %d: %s wasn't found", id);
                return undefined;
            }
            return student;
        } catch (error) {
            logger.error(
                'Error in UserRepository.findById for id %d: %s',
                id,
                getErrorMessage(error)
            );
            throw error;
        }
    }

    // TODO la suppression logique et la mise à jour des profils
}
