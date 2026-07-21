import User from "@/models/User";
import type { IUser } from "@/models/User";

export class UserRepository {
  create(data: Partial<IUser>) {
    return User.create(data);
  }

  findByEmail(email: string) {
    return User.findOne({ email });
  }

  findByUsername(username: string) {
    return User.findOne({ username });
  }

  findById(id: string) {
    return User.findById(id).select("-password");
  }
}
