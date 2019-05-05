import { ContextParameters } from "graphql-yoga/dist/types";

import * as clients from "./clients";

export interface Context {
  clients: typeof clients;
}

export function createContext(_params: ContextParameters): Context {
  return { clients };
}

export default Context;
