const query = `subscription EVENTS {
  events {
    ... on ConnectEvent {
      type
      host
      port
    }
    ... on ConnectedEvent {
      type
      host
      port
    }
    ... on DisconnectEvent {
      type
    }
    ... on DisconnectedEvent {
      type
    }
  }
}
mutation CONNECT {
  connect {
    type
    host
    port
  }
}
mutation DISCONNECT {
  disconnect {
    type
  }
}`;
export default query;
