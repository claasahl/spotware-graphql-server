import { EventResolvers } from "../generated/graphql";

const resolvers: EventResolvers = {
  __resolveType: parent => (parent as any).type,
  session: parent => parent.session
};
export default resolvers;
