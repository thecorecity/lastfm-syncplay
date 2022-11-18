import BaseMessage from "../../base/BaseMessage.mjs";

export default class ErrorReply extends BaseMessage {
  constructor({message}) {
    super({
      $t: 'error',
      message
    })
  }
}