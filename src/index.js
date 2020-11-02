const repository = require('./api/repository');

class GitHubClient {
  constructor(config) {
    if (!config.host) {
      throw new Error("NO_HOST_ERROR");
    }
    if (!config.token) {
      throw new Error("NO_TOKEN_ERROR");
    }

    this.host = config.host;
    this.port = config.port;
    this.token = config.token;
    this.protocol = config.protocol || "https";
    this.apiVersion = config.apiVersion || "v3";
    this.path_prefix = config.path_prefix ? config.path_prefix : "/";
    this.promise = config.promise || Promise;

    this.repository = new repository(this);
  }

  buildURL(path, forcedVersion) {
    const apiBasePath = this.path_prefix + "api/";
    const version = forcedVersion || this.apiVersion;
    const pathname = apiBasePath + version + path;

    const {
      protocol,
      host
    } = this;
    const requestUrl = `${protocol}://${host}${pathname}`;

    return decodeURIComponent(requestUrl);
  }

  async makeRequest(options) {
    const opts = {
      method: options.method || "GET",
      headers: {
        "Authorization": `token ${this.token}`,
        ...options.headers
      }
    }

    if (options.qs) {
      const query = Object.keys(options.qs)
        .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(options.qs[k]))
        .join("&");
      opts.uri = `${options.uri}?${query}`;
    }

    if (options.body) {
      opts.body = JSON.stringify(options.body);
    }

    const { uri, ...rest } = opts;

    try {
      const response = await fetch(uri, rest);
      const json = await response.json();
      return Promise.resolve(json);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

export default GitHubClient;
