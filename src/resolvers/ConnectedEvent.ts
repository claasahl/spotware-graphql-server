import { ConnectedEventResolvers } from "../generated/graphql";

const resolvers: ConnectedEventResolvers = {
  type: () => "ConnectedEvent",
  host: parent => parent.host,
  port: parent => parent.port
};
export default resolvers;
