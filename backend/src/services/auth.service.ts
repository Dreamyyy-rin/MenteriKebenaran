/*
* AuthService Example
* This is the file of logic, what we gonna do when a data is sent.
* This code and comments is allowed to delete.
*/

import bcrypt from "bcrypt";
import { UserRepository } from "@/repositories/user.repository";

export class AuthService {
    private repository = new UserRepository();

    async register(data: any) {
    const hash = await bcrypt.hash(data.password, 10);

    data.password = hash;

    return this.repository.create(data);
  }
}
