import { BaseService } from "./BaseService";
import { UserSchema } from "../models/schemas";
import type { UserEntity, SignupForm } from "../forms/user";

export class UserService extends BaseService<UserEntity> {
  constructor() {
    super(UserSchema);
  }

  async createUser(data: SignupForm): Promise<UserEntity> {
    const password_hash = await Bun.password.hash(data.password);
    return await this.create({
      email: data.email,
      password_hash,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.findByField("email", email);
  }

  async verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(plainPassword, hash);
  }
}