const config = {
  heartbeatInterval: 10000,
  clientMsgId: () => {
    return new Date().toISOString();
  }
};
export default config;
