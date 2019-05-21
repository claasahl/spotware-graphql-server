import { types, IType, IField } from "@claasahl/spotware-protobuf";
import fs from "fs";

import { typeName } from "./util";
import { IEnum } from "protobufjs";

function graphqlBaseType(field: IField): string {
  switch (field.type) {
    case "uint64":
    case "int64":
    case "double":
    case "string":
    case "bytes":
      return "String";
    case "uint32":
    case "int32":
      return "Int";
    case "bool":
      return "Boolean";
    default:
      return typeName(field.type);
  }
}

function graphqlType(field: IField): string {
  const baseType = graphqlBaseType(field);
  switch (field.rule) {
    case undefined:
      return baseType;
    case "repeated":
      return "[" + baseType + "!]!";
    case "required":
      return baseType + "!";
    default:
      return baseType + "--" + field.rule;
  }
}

function graphql(key: string, value: IType) {
  const fields: string[] = [];
  for (const fieldname in value.fields) {
    const field = value.fields[fieldname];
    fields.push(`  ${fieldname}: ${graphqlType(field)}`);
  }

  const name = typeName(key);
  return `type ${name} {
${fields.join("\n")}
}
`;
}

function graphqlEnum(key: string, field: IEnum) {
  const values: string[] = [];
  for (const value in field.values) {
    values.push(value);
  }
  const name = typeName(key);
  return `enum ${name} {${values.join(" ")}}
`;
}

type TYPES = {
  enums: Map<string, IEnum>;
  types: Map<string, IType>;
};
function schema(name: string, content: TYPES): void {
  const stream = fs.createWriteStream("src/generated/schema/" + name);
  content.types.forEach((value, key) => {
    stream.write(graphql(key, value));
  });
  content.enums.forEach((value, key) => {
    stream.write(graphqlEnum(key, value));
  });
  stream.close();
}

schema("commonMessages.graphql", types.commonMessages);
schema("commonModelMessages.graphql", types.commonModelMessages);
schema("messages.graphql", types.messages);
schema("modelMessages.graphql", types.modelMessages);

const typeNames: string[] = [];
const mutations: { name: string; type: IType }[] = [];
types.commonMessages.types.forEach((value, key) => {
  typeNames.push(typeName(key));
  mutations.push({ name: typeName(key, false), type: value });
});
types.messages.types.forEach((value, key) => {
  typeNames.push(typeName(key));
  mutations.push({ name: typeName(key, false), type: value });
});
const payloadType = `union Payload =
  | ${typeNames.join("\n  | ")}
`;
fs.writeFileSync("./src/generated/schema/payload.graphql", payloadType);

const mutationType = `type Mutation {
  ${mutations
    .filter(({ name }) => name.endsWith("Req"))
    .map(entry => justdoit(entry.name, entry.type))
    .join("\n  ")}
}  
`;
fs.writeFileSync("./src/generated/schema/mutation.graphql", mutationType);

function justdoit(name: string, type: IType): string {
  const fields: string[] = [];
  for (const fieldname in type.fields) {
    const field = type.fields[fieldname];
    fields.push(`${fieldname}: ${graphqlType(field)}`);
  }
  if (fields.length > 0) {
    return `${name}(${fields.join(", ")}): SpotwareMessageEvent!`;
  }
  return `${name}: SpotwareMessageEvent!`;
}
