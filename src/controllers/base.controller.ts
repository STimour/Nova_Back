import { Request, Response } from 'express';

export abstract class BaseController {
    public async login(req: Request, res: Response): Promise<void> {}

    public async logout(req: Request, res: Response): Promise<void> {}
}
