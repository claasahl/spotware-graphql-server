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
    if (fieldname !== "payloadType") {
      const field = value.fields[fieldname];
      fields.push(`  ${fieldname}: ${graphqlType(field)}`);
    }
  }

  const name = typeName(key);
  return `type ${name} implements SpotwareEvent {
  SESSION: String!
  TYPE: String!
  payloadType: Int
  clientMsgId: String
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

const stream = fs.createWriteStream("src/schema/subscription.graphql");
const typeNames: string[] = [];
types.commonMessages.types.forEach((value, key) => {
  if (key !== "ProtoMessage") {
    typeNames.push(typeName(key));
    stream.write(graphql(key, value));
  }
});
types.messages.types.forEach((value, key) => {
  typeNames.push(typeName(key));
  stream.write(graphql(key, value));
});
types.commonModelMessages.types.forEach((value, key) => {
  stream.write(graphql(key, value));
});
types.modelMessages.types.forEach((value, key) => {
  stream.write(graphql(key, value));
});

types.commonMessages.enums.forEach((value, key) => {
  stream.write(graphqlEnum(key, value));
});
types.commonModelMessages.enums.forEach((value, key) => {
  stream.write(graphqlEnum(key, value));
});
types.messages.enums.forEach((value, key) => {
  stream.write(graphqlEnum(key, value));
});
types.modelMessages.enums.forEach((value, key) => {
  stream.write(graphqlEnum(key, value));
});

const footer = `  type Subscription {
    events: Events!
  }
  
  interface Event {
    SESSION: String!
    TYPE: String!
  }
  interface SpotwareEvent {
    SESSION: String!
    TYPE: String!
    payloadType: Int
    clientMsgId: String
  }
  union Events =
      ConnectEvent
    | ConnectedEvent
    | DisconnectEvent
    | DisconnectedEvent
    | ${typeNames.join("\n    |")}
  type ConnectEvent implements Event {
    SESSION: String!
    TYPE: String!
    host: String!
    port: Int!
  }
  type ConnectedEvent implements Event {
    SESSION: String!
    TYPE: String!
    host: String!
    port: Int!
  }
  type DisconnectEvent implements Event {
    SESSION: String!
    TYPE: String!
  }
  type DisconnectedEvent implements Event {
    SESSION: String!
    TYPE: String!
  }
  `;
stream.write(footer);
stream.close();
