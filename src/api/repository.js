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

  async listAllPullRequest({ options, projection, selection, breakFn, prs = [] }) {
    const response = await this.listPullRequests(options);
    let current = _(response).value();

    if (selection && typeof selection == "function") {
      current = current.filter(issue => selection(issue));
    }
    if (projection && typeof projection == "function") {
      current = current.map(issue => projection(issue));
    }
    prs.push(...current);

    if ((breakFn && typeof selection == "function" && breakFn(response)) || response.length <= 0) {
      return prs;
    } else {
      const {
        qs,
        ...rest
      } = options;
      const {
        page = 1
      } = qs;

      return await this.listAllPullRequest({ options: { ...rest, qs: { ...qs, page: page + 1 } }, projection, selection, breakFn, prs });
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
