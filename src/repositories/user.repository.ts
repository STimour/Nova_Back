import { Availability } from './../models/Availability.model';
import { Reputation } from './../models/Reputation.model';
import { IUser, UserCreationAttributes } from '../models/interfaces/IUser';
import { User } from '../models/User.model';
import logger from '../utils/logger';
import { IUserRepository } from './interfaces/IUserRepository';
import { getErrorMessage } from '../middlwares/errorHandler.middlewares';
import ErrorMessages from '../utils/error.messages';

class UserRepository implements IUserRepository {
    private readonly USER_FOUND: boolean;

    constructor() {
        this.USER_FOUND = true;
    }

    public async findAllUsers(): Promise<User[] | undefined> {
        try {
            const users = await User.findAll();
            if(!users || users.length === 0){
                logger.warn(ErrorMessages.errorFetchingUsers())
                return undefined;
            }
            return users
        } catch (error) {
            logger.error('Error in UserRepository.findAllUsers: %s', getErrorMessage(error));
            return undefined;
        }
    }

    public async findUser(id: number, deleted?: boolean): Promise<User | null> {
        try {
            const whereClause: any = { id: id };
            if (typeof deleted !== 'undefined') {
                whereClause.deleted = deleted;
            }

            const user: User | null = await User.findOne({
                where: whereClause
            });

            if (user === null) {
                logger.error("User for id %d: %s wasn't found", id);
                return null;
            }

            return user;
        } catch (error) {
            logger.error('Error in UserRepository.findUser: %s', getErrorMessage(error));
            return null;
        }
    }

    public async findUserByEmail(email: string): Promise<User | undefined> {
        try {
            const user: User | null = await User.findOne({
                where: { email: email }
            });

            if (user === null) {
                return undefined;
            }

            return user;
        } catch (error) {
            logger.error('Error in UserRepository.findUserByEmail: %s', getErrorMessage(error));
            return undefined;
        }
    }

    public async findAllStudents(): Promise<User[] | undefined> {
        try {
            return await User.findAll({ where: { role: 'student' } });
        } catch (error) {
            logger.error('Error in UserRepository.findAllStudents: %s', getErrorMessage(error));
            return undefined;
        }
    }
    public async findAllHelpers(): Promise<User[] | undefined> {
        try {
            const users = await User.findAll({
                where: { role: 'helper' },
                include: [{ model: Reputation, as: 'reputations' }]
            });

            if (!users || users.length === 0) {
                logger.error("No helpers were found");
                return undefined;
            }

            return users;
        } catch (error) {
            logger.error('Error in UserRepository.findAllHelpers: %s', getErrorMessage(error));
            return undefined;
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

            if (user !== null) return this.USER_FOUND;

            return !this.USER_FOUND;
        } catch (error) {
            logger.error(
                'Error in UserRepository.verifyUserBeforeInscription for %s %s: %s',
                firstname,
                email,
                getErrorMessage(error)
            );
            return this.USER_FOUND;
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
            return false;
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
            return undefined;
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
            return undefined;
        }
    }

    public async deleteLogically(id: string): Promise<boolean> {
        try{
            const whereClause: any = { id: id, deleted: false };
            const [affectedRows] = await User.update(
                { deleted: true },
                { where: { whereClause }}
            );

            if (affectedRows === 0) {
                logger.warn(ErrorMessages.invalidUserId(), id);
                return false;
            }

            return true;

        }catch (error){
            logger.error(
                ErrorMessages.internalServerError(),
                id,
                getErrorMessage(error)
            );
            return false;
        }
    } 

    public async deleteDefinitely(id: string ): Promise<boolean> {
        try{
         
            const affectedRows = await User.destroy({where: {id: id}})
if (affectedRows === 0) {
                logger.warn(ErrorMessages.invalidUserId(), id);
                return false;
            }
            return true;
        }catch (error){
                logger.error(
                ErrorMessages.internalServerError(),
                id,
                getErrorMessage(error)
            );
            return false;
        }
    }
}

export default UserRepository;
