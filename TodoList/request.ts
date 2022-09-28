import * as Effect from "@effect/core/io/Effect";
import * as Either from "@tsplus/stdlib/data/Either";
import { pipe } from "@tsplus/stdlib/data/Function";

export class FetchError {
  readonly _tag = "FetchError";
  constructor(readonly error: unknown) {}
}

export const request = (input: RequestInfo, init?: RequestInit | undefined) =>
  Effect.asyncInterrupt<never, FetchError, Response>((resume) => {
    const controller = new AbortController();
    fetch(input, { ...(init ?? {}), signal: controller.signal })
      .then((response) => {
        resume(Effect.succeed(response));
      })
      .catch((error) => {
        resume(Effect.fail(new FetchError(error)));
      });

    return Either.left(
      Effect.sync(() => {
        controller.abort();
      })
    );
  });

export class InvalidJsonResponse {
  readonly _tag = "InvalidJsonResponse";
  constructor(readonly error: unknown) {}
}

export const jsonFromResponse = (response: Response) =>
  Effect.tryCatchPromise(
    () => response.json(),
    (error) => new InvalidJsonResponse(error)
  );
