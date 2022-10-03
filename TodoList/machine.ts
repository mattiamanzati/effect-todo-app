import { createMachine } from "xstate";
import { ListItem } from "./codecs";

export const appMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUD2FUEEAO2B0AMqgIYQCWAdlAMQBiYALgMYAWAygK5NNzxIjZUsMgzKoKiUAA9EAWgAsAZgBseAOwBOAIwAGbVq0AmQ8sUaANCACecxWrwBWeU+cAOHYp1bXWtQF8-SzQMHHwiUkoaemYWAFEAJ3jUeMkBIRExCX4ZBFkzBzxfNR1XNUN5HTUHNXlLGwQzPA1XUz1DTTNXQ1d5AKD0LFw8BKT46gAlRnj60EFhUXFUnLy1VQdlH261LQdDbXla60QevFcHD2Vt7Y0HBx8AwJAKdDhU4MGwknIqVLmMxeyckuaw0iiUG1B8i0FiOuUarhUWjsGmUymamh0yj6IHeoUIX0gv3SCyy0jkhh0hlOygqdhUNwcGnKdTkSkcbiq8mUdwOPV6j1xQxGySJ80ySzk3h07LpejOe1MLIQFNOq0xxlRKjBRmxguwov+pJAy2K0sZYJUrkh0KVsgMBQcik8PkpdguDz8QA */
  createMachine({
  tsTypes: {} as import("./machine.typegen").Typegen0,
  schema: {
    context: {
      data: [] as ListItem[],
    },
    events: {} as
      | { type: "FetchSuccess"; data: ListItem[] }
      | { type: "FetchError" }
      | { type: "Retry" },
  },
  id: "TodoApp",
  initial: "Loading",
  states: {
    Loading: {
      invoke: {
        src: "fetchListItems",
      },
      on: {
        FetchSuccess: {
          actions: "setListItems",
          target: "Loaded",
        },
        FetchError: {
          target: "Error",
        },
      },
    },
    Loaded: {},
    Error: {
      on: {
        Retry: {
          target: "Loading",
        },
      },
    },
  },
});
