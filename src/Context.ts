import { ContextParameters } from "graphql-yoga/dist/types";

import * as clients from "./clients";

export interface Context {
  sessionId: string;
  clients: typeof clients;
}

export function createContext(_params: ContextParameters): Context {
  return { sessionId: "CHANGE ME", clients };
}

export default Context;
