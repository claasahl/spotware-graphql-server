import camelCase from "camelcase";

import { PayloadResolvers } from "../generated/graphql";
import { typeName } from "../scripts/util";

const resolvers: PayloadResolvers = {
  __resolveType: parent =>
    typeName(camelCase(parent.payloadType as any, { pascalCase: true })) as any
};

export default resolvers;
