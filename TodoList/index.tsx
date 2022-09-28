import { ListItem, Todo } from "./codecs";
import React from "react";
import { TodoListContainer, TodoListEntry } from "./components";
import * as Effect from "@effect/core/io/Effect";
import * as FiberId from "@effect/core/io/FiberId";
import * as Exit from "@effect/core/io/Exit";
import * as Chunk from "@tsplus/stdlib/collections/Chunk";
import { pipe } from "@tsplus/stdlib/data/Function";
import { getTodos, getUser } from "./api";

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
  const [items, setItems] = React.useState<ListItem[]>([]);

  React.useEffect(() => {
    const interrupt = Effect.unsafeRunWith(getListItems, (ex) => {
      if (Exit.isSuccess(ex)) {
        setItems(ex.value);
      } else {
        console.error(ex.cause);
      }
    });
    return () => interrupt(FiberId.none)((_) => {});
  }, []);

  return (
    <TodoListContainer>
      {items.map((listItem) => (
        <TodoListEntry key={listItem.id} {...listItem} />
      ))}
    </TodoListContainer>
  );
}
