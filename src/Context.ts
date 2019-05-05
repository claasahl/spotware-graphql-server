import { ContextParameters } from "graphql-yoga/dist/types";

import * as clients from "./clients";

export interface Context {
  sessionId: string;
  clients: typeof clients;
}

export function createContext(params: ContextParameters): Context {
  if (params.request) {
    const sessionId = params.request.sessionID || "CHANGE ME";
    return { sessionId, clients };
  } else if (params.connection) {
    const sessionId = params.connection.context.sessionID || "CHANGE ME";
    return { sessionId, clients };
  }
  return { sessionId: "CHANGE ME", clients };
}

export default Context;
