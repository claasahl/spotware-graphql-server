import { Resolvers } from "../generated/graphql";

import ConnectEvent from "./ConnectEvent";
import ConnectedEvent from "./ConnectedEvent";
import DisconnectEvent from "./DisconnectEvent";
import DisconnectedEvent from "./DisconnectedEvent";
import Event from "./Event";
import Events from "./Events";
import Query from "./Query";
import Subscription from "./Subscription";
import { IResolvers } from "graphql-tools";

const resolvers: Resolvers & IResolvers = {
  ConnectEvent,
  ConnectedEvent,
  DisconnectEvent,
  DisconnectedEvent,
  Event,
  Events,
  Query,
  Subscription
};
export default resolvers;
