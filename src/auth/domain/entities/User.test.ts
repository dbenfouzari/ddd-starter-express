import type { CreateUserProps } from "@auth/domain/entities/User";

import { User } from "@auth/domain/entities/User";
import { UserRoles } from "@auth/domain/value-objects";
import { EmailExceptions } from "@auth/domain/value-objects/Email";
import { FirstNameExceptions } from "@auth/domain/value-objects/FirstName";
import { LastNameExceptions } from "@auth/domain/value-objects/LastName";
import { PasswordExceptions } from "@auth/domain/value-objects/Password";

describe("User", () => {
  const validProps: CreateUserProps = {
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    password: "myComplexPassword123!",
    refreshToken: "",
  };

  it("should return a user when valid props are provided", () => {
    const userResult = User.create(validProps);

    expect(userResult.isOk()).toBe(true);
  });

  it("should fail when firstName is too short", () => {
    const userResult = User.create({
      ...validProps,
      firstName: "J",
    });

    expect(userResult.unwrapErr()).toBe(FirstNameExceptions.TooShort);
  });

  it("should fail when lastName is too short", () => {
    const userResult = User.create({
      ...validProps,
      lastName: "D",
    });

    expect(userResult.unwrapErr()).toBe(LastNameExceptions.TooShort);
  });

  it("should fail when email is invalid", () => {
    const userResult = User.create({
      ...validProps,
      email: "invalidEmail",
    });

    expect(userResult.unwrapErr()).toBe(EmailExceptions.IncorrectFormat);
  });

  it("should make id readable", () => {
    const userResult = User.create(validProps);

    expect(userResult.isOk()).toBe(true);
    expect(userResult.unwrap().id).toBeDefined();
  });

  it("should make email readable", () => {
    const userResult = User.create(validProps);

    expect(userResult.isOk()).toBe(true);
    expect(userResult.unwrap().email).toBe(validProps.email);
  });

  describe("password", () => {
    it("should fail when password is too short", () => {
      const userResult = User.create({
        ...validProps,
        password: "123",
      });

      expect(userResult.unwrapErr()).toBe(PasswordExceptions.TooShort);
    });

    it("should fail when password doesn't have a number", () => {
      const userResult = User.create({
        ...validProps,
        password: "myComplexPassword!",
      });

      expect(userResult.unwrapErr()).toBe(PasswordExceptions.MustHaveAtLeastOneNumber);
    });

    it("should fail when password doesn't have an uppercase letter", () => {
      const userResult = User.create({
        ...validProps,
        password: "mycomplexpassword123!",
      });

      expect(userResult.unwrapErr()).toBe(
        PasswordExceptions.MustHaveAtLeastOneUpperCaseLetter
      );
    });

    it("should fail when password doesn't have a lowercase letter", () => {
      const userResult = User.create({
        ...validProps,
        password: "MYCOMPLEXPASSWORD123!",
      });

      expect(userResult.unwrapErr()).toBe(
        PasswordExceptions.MustHaveAtLeastOneLowerCaseLetter
      );
    });

    it("should fail when password doesn't have a special character", () => {
      const userResult = User.create({
        ...validProps,
        password: "MyComplexPassword123",
      });

      expect(userResult.unwrapErr()).toBe(
        PasswordExceptions.MustHaveAtLeastOneSpecialCharacter
      );
    });
  });

  describe("role", () => {
    it("should set role to user when no role is provided", () => {
      const userResult = User.create(validProps);

      expect(userResult.isOk()).toBe(true);
      expect(userResult.unwrap().props.role.props.value).toBe(UserRoles.USER);
    });

    it("should set role to admin when admin role is provided", () => {
      const userResult = User.create({
        ...validProps,
        role: UserRoles.ADMIN,
      });

      expect(userResult.isOk()).toBe(true);
      expect(userResult.unwrap().props.role.props.value).toBe(UserRoles.ADMIN);
    });

    it("should fail when an invalid role is provided", () => {
      const userResult = User.create({
        ...validProps,
        // @ts-expect-error Testing invalid role
        role: "invalidRole",
      });

      expect(userResult.isErr()).toBe(true);
    });
  });

  describe("logout", () => {
    it("should set refreshToken to null", () => {
      const userResult = User.create(validProps);

      expect(userResult.isOk()).toBe(true);
      expect(userResult.unwrap().props.refreshToken).toBe("");

      userResult.unwrap().logOut();

      expect(userResult.unwrap().props.refreshToken).toBeUndefined();
    });
  });

  describe("login", () => {
    it("should set refreshToken", () => {
      const userResult = User.create(validProps);

      expect(userResult.isOk()).toBe(true);
      expect(userResult.unwrap().props.refreshToken).toBe("");

      userResult.unwrap().logIn("123");

      expect(userResult.unwrap().props.refreshToken).toBe("123");
    });
  });
});
