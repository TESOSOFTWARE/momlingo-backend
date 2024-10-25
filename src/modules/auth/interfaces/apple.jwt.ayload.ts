import { JwtPayload } from 'jsonwebtoken';

export interface AppleJwtPayload extends JwtPayload {
  email?: string;
  name?: {
    firstName?: string;
    lastName?: string;
  };
}
