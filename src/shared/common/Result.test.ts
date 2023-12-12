import type { Result } from "./Result";
import type { Option } from "@shared/common/Option";

import { None, Some } from "@shared/common/Option";
import { ResultCannotGetErrorOfSuccess } from "@shared/domain/errors/ResultCannotGetErrorOfSuccess";
import { ResultCannotGetValueOfFailure } from "@shared/domain/errors/ResultCannotGetValueOfFailure";

import { Ok, Err } from "./Result";

describe("Result", () => {
  describe("and", () => {
    it("should return error since first value is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      const y: Result<number, string> = Err.of("late error");
      expect(x.and(y)).toStrictEqual(Err.of("late error"));
    });

    it("should return error since first value is Err", () => {
      const x: Result<number, string> = Err.of("early error");
      const y: Result<number, string> = Ok.of(2);
      expect(x.and(y)).toStrictEqual(Err.of("early error"));
    });

    it("should return Ok since both values are Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      const y: Result<number, string> = Ok.of(100);
      expect(x.and(y)).toStrictEqual(Ok.of(100));
    });
  });

  describe("andThen", () => {
    it("should return error since first value is Ok", () => {
      const sq = (x: number): Result<number, number> => Ok.of(x * x);
      const err = (x: number): Result<number, number> => Err.of(x);

      expect(Ok.of(2).andThen(sq).andThen(sq)).toStrictEqual(Ok.of(16));
      expect(Ok.of(2).andThen(sq).andThen(err)).toStrictEqual(Err.of(4));
      expect(Ok.of(2).andThen(err).andThen(sq)).toStrictEqual(Err.of(2));
      expect(Err.of<number, number>(3).andThen(sq).andThen(sq)).toStrictEqual(Err.of(3));
    });
  });

  describe("`or`", () => {
    it("should return first value since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      const y: Result<number, string> = Err.of("late error");
      expect(x.or(y)).toStrictEqual(Ok.of(2));
    });

    it("should return second value since first value is Err", () => {
      const x: Result<number, string> = Err.of("early error");
      const y: Result<number, string> = Ok.of(2);
      expect(x.or(y)).toStrictEqual(Ok.of(2));
    });

    it("should return first value since both values are Err", () => {
      const x: Result<number, string> = Err.of("not a 2");
      const y: Result<number, string> = Err.of("late error");
      expect(x.or(y)).toStrictEqual(Err.of("late error"));
    });
  });

  describe("`orElse`", () => {
    it("should return first value since it is Ok", () => {
      const sq = (x: number): Result<number, number> => Ok.of(x * x);
      const err = (x: number): Result<number, number> => Err.of(x);

      expect(Ok.of<number, number>(2).orElse(sq).orElse(sq)).toStrictEqual(Ok.of(2));
      expect(Ok.of<number, number>(2).orElse(err).orElse(sq)).toStrictEqual(Ok.of(2));
      expect(Err.of<number, number>(3).orElse(sq).orElse(err)).toStrictEqual(Ok.of(9));
      expect(Err.of<number, number>(3).orElse(err).orElse(err)).toStrictEqual(Err.of(3));
    });
  });

  describe("`ok`", () => {
    it("should return Some since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(x.ok()).toStrictEqual(Some.of(2));
    });

    it("should return None since it is Err", () => {
      const x: Result<number, string> = Err.of("Nothing here");
      expect(x.ok()).toStrictEqual(new None());
    });
  });

  describe("`err`", () => {
    it("should return Some since it is Err", () => {
      const x: Result<number, string> = Err.of("Nothing here");
      expect(x.err()).toStrictEqual(Some.of("Nothing here"));
    });

    it("should return None since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(x.err()).toStrictEqual(new None());
    });
  });

  describe("`expect`", () => {
    it("should return value since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(x.expect("Testing expect")).toBe(2);
    });

    it("should throw error since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing expect");
      expect(() => x.expect("Testing expect")).toThrow("Testing expect");
    });
  });

  describe("`expectErr`", () => {
    it("should return error since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing expectErr");
      expect(x.expectErr("Testing expectErr")).toBe("Testing expectErr");
    });

    it("should throw error since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(() => x.expectErr("Testing expectErr")).toThrow("Testing expectErr");
    });
  });

  describe("`isErr`", () => {
    it("should return true since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing isErr");
      expect(x.isErr()).toBe(true);
    });

    it("should return false since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(x.isErr()).toBe(false);
    });
  });

  describe("`isErrAnd`", () => {
    it("should return true since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing isErrAnd");
      expect(x.isErrAnd((e) => e === "Testing isErrAnd")).toBe(true);
    });

    it("should return false since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(x.isErrAnd((e) => e === "Testing isErrAnd")).toBe(false);
    });
  });

  describe("`isOk`", () => {
    it("should return true since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(x.isOk()).toBe(true);
    });

    it("should return false since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing isOk");
      expect(x.isOk()).toBe(false);
    });
  });

  describe("`isOkAnd`", () => {
    it("should return true since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(x.isOkAnd((e) => e === 2)).toBe(true);
    });

    it("should return false since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing isOkAnd");
      expect(x.isOkAnd((e) => e === 2)).toBe(false);
    });
  });

  describe("`map`", () => {
    it("should return Ok since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(x.map((e) => e * 2)).toStrictEqual(Ok.of(4));
    });

    it("should return Err since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing map");
      expect(x.map((e) => e * 2)).toStrictEqual(Err.of("Testing map"));
    });
  });

  describe("`mapErr`", () => {
    it("should return Ok since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(x.mapErr((e) => e + " mapErr")).toStrictEqual(Ok.of(2));
    });

    it("should return Err since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing mapErr");
      expect(x.mapErr((e) => e + " mapErr")).toStrictEqual(
        Err.of("Testing mapErr mapErr")
      );
    });
  });

  describe("`mapOr`", () => {
    it("should return 2 since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(x.mapOr(0, (e) => e * 2)).toBe(4);
    });

    it("should return 0 since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing mapOr");
      expect(x.mapOr(0, (e) => e * 2)).toBe(0);
    });
  });

  describe("`mapOrElse`", () => {
    it("should return 2 since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(
        x.mapOrElse(
          () => 0,
          (e) => e * 2
        )
      ).toBe(4);
    });

    it("should return 0 since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing mapOrElse");
      expect(
        x.mapOrElse(
          () => 0,
          (e) => e * 2
        )
      ).toBe(0);
    });
  });

  describe("`unwrap`", () => {
    it("should return value since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(x.unwrap()).toBe(2);
    });

    it("should throw error since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing unwrap");
      expect(() => x.unwrap()).toThrow(ResultCannotGetValueOfFailure);
    });
  });

  describe("`unwrapErr`", () => {
    it("should return error since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing unwrapErr");
      expect(x.unwrapErr()).toBe("Testing unwrapErr");
    });

    it("should throw error since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(() => x.unwrapErr()).toThrow(ResultCannotGetErrorOfSuccess);
    });
  });

  describe("`unwrapOr`", () => {
    it("should return value since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(x.unwrapOr(0)).toBe(2);
    });

    it("should return default value since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing unwrapOr");
      expect(x.unwrapOr(0)).toBe(0);
    });
  });

  describe("`unwrapOrElse`", () => {
    it("should return value since it is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      expect(x.unwrapOrElse(() => 0)).toBe(2);
    });

    it("should return default value since it is Err", () => {
      const x: Result<number, string> = Err.of("Testing unwrapOrElse");
      expect(x.unwrapOrElse(() => 0)).toBe(0);
    });
  });

  describe("`transpose`", () => {
    it("should return Some(Ok(2)) since it is Ok(Some(2))", () => {
      const x: Result<number, string> = Ok.of(2);

      expect(x.transpose()).toStrictEqual(Some.of(Ok.of(2)));
    });

    it("should return Some(Err('Testing transpose')) since it is Err(Some('Testing transpose'))", () => {
      const x: Result<number, string> = Err.of("Testing transpose");

      expect(x.transpose()).toStrictEqual(Some.of(Err.of("Testing transpose")));
    });

    it("should return None since it is Ok(None)", () => {
      const x: Result<Option<number>, string> = Ok.of(new None());

      expect(x.transpose()).toStrictEqual(new None());
    });
  });
});
