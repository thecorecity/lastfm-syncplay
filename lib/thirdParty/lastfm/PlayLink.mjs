export default class LastFm_PlayLink {
  #payload;

  constructor(payload) {
    this.#payload = payload;
  }

  get affiliate() {
    return this.#payload.affiliate;
  }

  get url() {
    return this.#payload.url;
  }

  get id() {
    return this.#payload.id;
  }

  get source() {
    return this.#payload.source;
  }
}