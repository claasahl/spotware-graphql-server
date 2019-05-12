import { EventResolvers } from "../generated/graphql";

const resolvers: EventResolvers = {
  __resolveType: parent => parent.type,
  type: parent => parent.type,
  session: parent => parent.session
};
export default resolvers;
