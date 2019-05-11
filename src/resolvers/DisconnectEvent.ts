import { DisconnectEventResolvers } from "../generated/graphql";

const resolvers: DisconnectEventResolvers = {
  session: parent => parent.session,
  type: () => "DisconnectEvent"
};
export default resolvers;
