import { Child } from '../../children/entities/child.entity';
import { User } from '../../users/entities/user.entity';

export interface UserWithChildren extends User {
  children: Child[];
}
