import { Resolvers } from "../generated/graphql";
import { IResolvers } from "graphql-tools";

import ConnectEvent from "./ConnectEvent";
import ConnectedEvent from "./ConnectedEvent";
import DisconnectEvent from "./DisconnectEvent";
import DisconnectedEvent from "./DisconnectedEvent";
import SpotwareMessageEvent from "./SpotwareMessageEvent";
import SpotwareResolvers from "../generated/resolvers";
import Event from "./Event";
import Events from "./Events";
import Query from "./Query";
import Subscription from "./Subscription";
import Mutation from "./Mutation";

const resolvers: Resolvers & IResolvers = {
  ConnectEvent,
  ConnectedEvent,
  DisconnectEvent,
  DisconnectedEvent,
  SpotwareMessageEvent,
  ...SpotwareResolvers,
  Event,
  Events,
  Query,
  Subscription,
  Mutation
};
export default resolvers;
