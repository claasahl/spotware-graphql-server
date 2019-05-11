export function typeName(key: string): string {
  return key.replace("ProtoOA", "OpenApi").replace("Proto", "");
}
