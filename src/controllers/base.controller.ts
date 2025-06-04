import { Request, Response } from 'express';

export abstract class BaseController {
  public async login(req: Request, res: Response): Promise<void> {
    const newUser = req.body;
    
  }

  public async logout(req: Request, res: Response): Promise<void> {
    
  }
}
