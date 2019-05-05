import { PubSub } from "graphql-yoga";
import { ContextParameters } from "graphql-yoga/dist/types";

export interface Context {
  pubsub: PubSub;
}

const pubsub = new PubSub();
export function createContext(_params: ContextParameters): Context {
  return { pubsub };
}

export default Context;
