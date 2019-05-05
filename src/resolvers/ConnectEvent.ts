import { ConnectEventResolvers } from "../generated/graphql";

const resolvers: ConnectEventResolvers = {
  type: () => "ConnectEvent",
  host: parent => parent.host,
  port: parent => parent.port
};
export default resolvers;
