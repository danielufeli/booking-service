import HttpResponse from "../common/HttpResponse";
import { UserService } from "../services/UserService";
import type { SignupForm, SigninForm } from "../forms/user";
import jwt from "jsonwebtoken";

export class UserController {
  private userService = new UserService();

  async signup(req: Request): Promise<Response> {
    const body = (await req.json()) as SignupForm;

    if (!body.email || !body.email.includes("@")) {
      return HttpResponse.failure("A valid email is required", 400);
    }
    if (!body.password || body.password.length < 8) {
      return HttpResponse.failure("Password must be at least 8 characters", 400);
    }

    const existing = await this.userService.findByEmail(body.email);
    if (existing) {
      return HttpResponse.failure("Email already in use", 409);
    }

    const user = await this.userService.createUser(body);

    const { password_hash, ...safeUser } = user;
    return HttpResponse.success("User created successfully", safeUser, 201);
  }
  async signin(req: Request): Promise<Response> {
    const body = (await req.json()) as SigninForm;

    if (!body.email || !body.password) {
      return HttpResponse.failure("Invalid email or password", 401);
    }

    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      return HttpResponse.failure("Invalid email or password", 401);
    }

    const isValid = await this.userService.verifyPassword(body.password, user.password_hash);
    if (!isValid) {
      return HttpResponse.failure("Invalid email or password", 401);
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return HttpResponse.success("Signed in successfully", { token });
  }

}