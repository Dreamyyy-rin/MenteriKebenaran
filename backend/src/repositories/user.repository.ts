/*
* User Repository Example
* Communicating with the database through the Model that we created on /src/models
* This code and comments is allowed to delete.
*/

import User from "@/models/User";

export class UserRepository {
    create(data: any) {
      return User.create(data);
    }

    findByEmail(email: string) {
      return User.findOne({ email });
    }

    findById(id: string) {
      return User.findById(id);
    }
}
