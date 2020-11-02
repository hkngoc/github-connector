class AliasClient {
  constructor(client) {
    this.client = client;
  }

  someRestApi(opts) {
    return this.client.makeRequest(opts);
  }
}

export default AliasClient;
