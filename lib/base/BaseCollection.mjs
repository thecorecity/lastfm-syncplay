import crypto from 'crypto';

export default class BaseCollection {
  /**
   * @type {Server}
   * @protected
   */
  _server;

  /**
   * @protected
   */
  _contents = new Map();

  constructor(server) {
    this._server = server;
  }

  /**
   * @return {string}
   * @protected
   */
  _generateId() {
    let id;

    let iteration = 0;

    do {
      id = crypto.randomBytes(6).toString('base64url');
    } while (this._contents.has(id) && iteration++ < 10);

    if (iteration > 5) {
      throw new Error('Failed to generate ID!');
    }

    return id;
  }
}