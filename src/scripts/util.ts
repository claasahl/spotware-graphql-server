import camelCase from "camelcase";

export function typeName(key: string, pascalCase = true): string {
  return camelCase(
    key
      .replace("ProtoOA", "OpenApi")
      .replace("Proto", "")
      .replace("Oa", "OpenApi"),
    { pascalCase }
  );
}
