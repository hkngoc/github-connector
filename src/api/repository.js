class RepositoryClient {
  constructor(client) {
    this.client = client;
  }

  listPullRequests(opts) {
    const {
      full_name,
      ...rest
    } = opts;

    const options = {
      ...rest,
      uri: this.client.buildURL(`/repos/${full_name}/pulls`),
      method: "GET"
    }

    return this.client.makeRequest(options);
  }

  async listAllPullRequest(opts, prs = []) {
    const r = await this.listPullRequests(opts);
    prs.push(...r);

    if (r.length > 0) {
      const {
        qs,
        ...rest
      } = opts;
      const {
        page = 1
      } = qs;

      return await this.listAllPullRequest({ ...rest, qs: { ...qs, page: page + 1 } }, prs);
    } else {
      return prs;
    }
  }

  getComments(opts) {
    const {
      full_name,
      number,
      ...rest
    } = opts;

    const options = {
      ...rest,
      uri: this.client.buildURL(`/repos/${full_name}/pulls/${number}/comments`),
      method: "GET"
    }

    return this.client.makeRequest(options);
  }

  getDetails(opts) {
    const {
      full_name,
      number,
      ...rest
    } = opts;

    const options = {
      ...rest,
      uri: this.client.buildURL(`/repos/${full_name}/pulls/${number}`),
      method: "GET"
    }

    return this.client.makeRequest(options);
  }
}

export default RepositoryClient;
