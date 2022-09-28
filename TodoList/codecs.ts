import * as Z from "zod";
import * as Effect from "@effect/core/io/Effect";
import { pipe } from "@tsplus/stdlib/data/Function";

export const User = Z.object({
  id: Z.number(),
  username: Z.string(),
});
export interface User extends Z.TypeOf<typeof User> {}
export type UserId = User["id"];

export class InvalidUserObject {
  readonly _tag = "InvalidUserObject";
  constructor(readonly value: unknown) {}
}

export const parseUser = (value: unknown) =>
  pipe(
    Effect.sync(() => User.safeParse(value)),
    Effect.flatMap((result) =>
      result.success
        ? Effect.succeed(result.data)
        : Effect.fail(new InvalidUserObject(value))
    )
  );

export const Todo = Z.object({
  id: Z.number(),
  userId: Z.number(),
  title: Z.string(),
  completed: Z.boolean(),
});
export interface Todo extends Z.TypeOf<typeof Todo> {}
export type TodoId = Todo["id"];

export class InvalidTodoObject {
  readonly _tag = "InvalidTodoObject";
  constructor(readonly value: unknown) {}
}

export const parseTodo = (value: unknown) =>
  pipe(
    Effect.sync(() => Todo.safeParse(value)),
    Effect.flatMap((result) =>
      result.success
        ? Effect.succeed(result.data)
        : Effect.fail(new InvalidTodoObject(value))
    )
  );

export class InvalidTodoArray {
  readonly _tag = "InvalidTodoArray";
  constructor(readonly value: unknown) {}
}

export const parseTodos = (value: unknown) =>
  pipe(
    Effect.sync(() => Z.array(Todo).safeParse(value)),
    Effect.flatMap((result) =>
      result.success
        ? Effect.succeed(result.data)
        : Effect.fail(new InvalidTodoArray(value))
    )
  );

export interface ListItem {
  id: TodoId;
  title: string;
  completed: boolean;
  username: string;
}
