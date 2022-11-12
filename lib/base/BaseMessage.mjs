export default class BaseMessage {
  /**
   * @protected
   */
  _payload;

  constructor(payload) {
    this._payload = payload;
  }

  get type() {
    return this._payload['$t'];
  }

  get payload() {
    return this._payload;
  }

  toString() {
    return JSON.stringify(this._payload);
  }
}