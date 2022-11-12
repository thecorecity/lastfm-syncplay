import BaseMessage from "../../base/BaseMessage.mjs";

export default class UserAuthReply extends BaseMessage {
  constructor({userId}) {
    super({
      $t: 'hello',
      userId
    })
  }
}