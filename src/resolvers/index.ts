import { Resolvers } from "../generated/graphql";
import { IResolvers } from "graphql-tools";

import ConnectEvent from "./ConnectEvent";
import ConnectedEvent from "./ConnectedEvent";
import DisconnectEvent from "./DisconnectEvent";
import DisconnectedEvent from "./DisconnectedEvent";
import Event from "./Event";
import SpotwareResolvers from "../generated/resolvers";
import SpotwareEvent from "./SpotwareEvent";
import Events from "./Events";
import Query from "./Query";
import Subscription from "./Subscription";
import Mutation from "./Mutation";

const resolvers: Resolvers & IResolvers = {
  ConnectEvent,
  ConnectedEvent,
  DisconnectEvent,
  DisconnectedEvent,
  Event,
  ...SpotwareResolvers,
  SpotwareEvent,
  Events,
  Query,
  Subscription,
  Mutation
};
export default resolvers;
