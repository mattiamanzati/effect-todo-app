import { ListItem, Todo } from "./codecs";
import React from "react";
import * as Effect from "@effect/core/io/Effect";
import * as FiberId from "@effect/core/io/FiberId";
import * as Exit from "@effect/core/io/Exit";
import * as Chunk from "@tsplus/stdlib/collections/Chunk";
import { pipe } from "@tsplus/stdlib/data/Function";
import { getTodos, getUser } from "./api";
import { useMachine } from "@xstate/react";
import { appMachine } from "./machine";
import * as RN from "react-native";
import * as RNP from "react-native-paper";
import { assign } from "xstate";

const fetchListItem = (todo: Todo) =>
  pipe(
    getUser(todo.userId),
    Effect.map((user) => ({ ...user, ...todo }))
  );

const getListItems = pipe(
  getTodos,
  Effect.flatMap((todos) =>
    Effect.forEachPar(todos, (todo) => fetchListItem(todo))
  ),
  Effect.withParallelism(5),
  Effect.map((e) => Array.from(Chunk.toCollection(e)))
);

export default function TodoList() {
  const [state, send] = useMachine(appMachine, {
    actions: {
      setListItems: assign({
        data: (context, event) => event.data
      }),
    },
    services: {
      fetchListItems: (_, __) => (callback) => {
        const interrupt = Effect.unsafeRunWith(getListItems, (ex) => {
          if (Exit.isSuccess(ex)) {
            callback({ type: "FetchSuccess", data: ex.value });
          } else {
            callback({ type: "FetchError" });
          }
        });
        return () => interrupt(FiberId.none)((_) => {});
      },
    },
  });

  const onRetry = React.useCallback(() => send({ type: "Retry" }), [send]);

  if (state.matches("Loading")) {
    return (
      <RN.View style={{ padding: 18 }}>
        <RN.ActivityIndicator size={32} />
      </RN.View>
    );
  }

  if (state.matches("Error")) {
    return (
      <RN.View style={{ padding: 18 }}>
        <RNP.Text>Whops, an error occurred.</RNP.Text>
        <RNP.Button mode="contained" onPress={onRetry}>
          Retry
        </RNP.Button>
      </RN.View>
    );
  }

  return (
    <React.Fragment>
      {state.context.data.map((listItem) => (
        <RNP.List.Item
          left={() => (
            <RNP.Checkbox.Android
              status={listItem.completed ? "checked" : "unchecked"}
            />
          )}
          title={listItem.title}
          description={listItem.username}
        />
      ))}
    </React.Fragment>
  );
}
