import { DisconnectedEventResolvers } from "../generated/graphql";
import EventResolvers from "./Event";

const resolvers: DisconnectedEventResolvers = {
  ...EventResolvers,
  type: parent => parent.type
};
export default resolvers;
