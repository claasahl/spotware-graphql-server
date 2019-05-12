import { EventResolvers } from "../generated/graphql";
import { Omit } from "../types";

const resolvers: Omit<EventResolvers, "__resolveType"> = {
  session: parent => parent.session,
  type: parent => parent.type
};
export default resolvers;
