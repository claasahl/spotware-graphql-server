import { EventTypesResolvers } from "../generated/graphql";

const resolvers: EventTypesResolvers = {
  __resolveType: parent => (parent + "Type") as any
};
export default resolvers;
