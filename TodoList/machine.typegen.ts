// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    fetchListItems: "done.invoke.TodoApp.Loading:invocation[0]";
  };
  missingImplementations: {
    actions: "setListItems";
    services: "fetchListItems";
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    setListItems: "FetchSuccess";
  };
  eventsCausingServices: {
    fetchListItems: "Retry" | "xstate.init";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "Error" | "Loaded" | "Loading";
  tags: never;
}
