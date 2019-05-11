import { ConnectedEventResolvers } from "../generated/graphql";
import EventResolvers from "./Event";

const resolvers: ConnectedEventResolvers = {
  ...EventResolvers,
  host: parent => parent.host,
  port: parent => parent.port
};
export default resolvers;
