import * as Effect from "@effect/core/io/Effect";
import { pipe } from "@tsplus/stdlib/data/Function";
import { request, jsonFromResponse } from "./request";
import { parseTodos, parseUser, UserId } from "./codecs";

export const getTodos = pipe(
  request("https://jsonplaceholder.typicode.com/todos"),
  Effect.flatMap(jsonFromResponse),
  Effect.flatMap(parseTodos)
);

class UserNotFound {
  readonly _tag = "UserNotFound";
  constructor(readonly userId: UserId) {}
}

export const getUser = (userId: UserId) =>
  pipe(
    request("https://jsonplaceholder.typicode.com/users/" + userId),
    Effect.flatMap((response) =>
      response.status === 404
        ? Effect.fail(new UserNotFound(userId))
        : Effect.succeed(response)
    ),
    Effect.flatMap(jsonFromResponse),
    Effect.flatMap(parseUser)
  );
