export default class BaseEntity {
  /**
   * @protected
   */
  _id;
  /**
   * @type {Server}
   * @protected
   */
  _server;

  constructor({id, server}) {
    this._id = id;
    this._server = server;
  }

  get id() {
    return this._id;
  }
}