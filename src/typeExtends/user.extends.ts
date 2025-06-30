import { User } from '../models/User.model';

export interface HelperWithNote extends User {
    noteSemaine?: number;
}
