import { User } from "@prisma/client";
import { passwordHash } from "../../common/common";

export const mockUser:User = {
  id: 1,
  createdAt: new Date(Date.now()),
  userType: 'USER',
  nickname: 'test',
  email: 'test@wp.pl',
  password: passwordHash('1234'),
  spotifyToken: ''
}
