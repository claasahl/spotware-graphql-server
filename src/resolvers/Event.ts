import { EventResolvers } from "../generated/graphql";

const resolvers: EventResolvers = {
  __resolveType: () => null,
  session: parent => parent.session
};
export default resolvers;
