import BaseMessage from "../../base/BaseMessage.mjs";

export default class RoomCreateReply extends BaseMessage {
  constructor({roomId}) {
    super({
      $t: 'roomCreated',
      roomId
    })
  }
}