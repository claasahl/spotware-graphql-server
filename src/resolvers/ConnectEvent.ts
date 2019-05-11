import { ConnectEventResolvers } from "../generated/graphql";

const resolvers: ConnectEventResolvers = {
  session: parent => parent.session,
  type: () => "ConnectEvent",
  host: parent => parent.host,
  port: parent => parent.port
};
export default resolvers;
