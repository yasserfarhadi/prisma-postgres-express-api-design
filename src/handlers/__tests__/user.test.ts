import * as user from '../user';
import { Request, Response } from 'express';

// TODO: should use a test databse for testing
describe('user handler', () => {
  it('should create a new user', async () => {
    const req = { body: { username: 'hello', password: 'hi' } };
    const res = {
      json({ token }: { token: string }) {
        expect(token).toBeTruthy();
      },
    };
    user.createUser(req as Request, res as Response, () => {});
  });
});
