import { types, IType } from "@claasahl/spotware-protobuf";
import fs from "fs";

function typeName(key: string): string {
  return key.replace("ProtoOA", "OpenApi").replace("Proto", "");
}

function resolver(key: string, value: IType): string {
  const fieldnames: string[] = [];
  for (const fieldname in value.fields) {
    if (fieldname !== "payloadType") {
      fieldnames.push(`    ${fieldname}: parent => parent.${fieldname}`);
    }
  }
  const typename = typeName(key);
  return (
    `import { ${typename}Resolvers } from "../graphql";
import SpotwareEventResolvers from "../../resolvers/SpotwareEvent";

const resolvers: ${typename}Resolvers = {
    ...SpotwareEventResolvers,
` +
    fieldnames.join(",\n") +
    `
};
export default resolvers;
`
  );
}

const typeNames: string[] = [];
types.commonMessages.types.forEach((value, key) => {
  typeNames.push(typeName(key));
  const filename = typeName(key) + ".ts";
  const content = resolver(key, value);
  fs.writeFileSync("./src/generated/resolvers/" + filename, content);
});
types.messages.types.forEach((value, key) => {
  typeNames.push(typeName(key));
  const filename = typeName(key) + ".ts";
  const content = resolver(key, value);
  fs.writeFileSync("./src/generated/resolvers/" + filename, content);
});

const importsStatements = typeNames.map(
  name => `import ${name} from "./${name}";`
);
const content = `${importsStatements.join("\n")}

const resolvers = {
    ${typeNames.join(",\n")}
}
export default resolvers;`;
fs.writeFileSync("./src/generated/resolvers/index.ts", content);
