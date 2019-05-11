import { DisconnectedEventResolvers } from "../generated/graphql";

const resolvers: DisconnectedEventResolvers = {
  session: parent => parent.session,
  type: () => "DisconnectedEvent"
};
export default resolvers;
