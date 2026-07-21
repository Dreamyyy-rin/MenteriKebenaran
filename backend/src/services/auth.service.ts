import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "@/repositories/user.repository";
import { env } from "@/config/env";
import type { RegisterInput, LoginInput } from "@news-portal/shared";

export class AuthService {
  private repository = new UserRepository();

  async register(data: RegisterInput) {
    // Check if email is already taken
    const existingEmail = await this.repository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error("Email already registered");
    }

    // Check if username is already taken
    const existingUsername = await this.repository.findByUsername(data.username);
    if (existingUsername) {
      throw new Error("Username already taken");
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.repository.create({ ...data, password: hashedPassword });

    // Return user without password
    const { password: _pw, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

  async login(data: LoginInput) {
    const user = await this.repository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _pw, ...userWithoutPassword } = user.toObject();
    return { token, user: userWithoutPassword };
  }
}
