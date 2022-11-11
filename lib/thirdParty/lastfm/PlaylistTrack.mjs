import LastFm_PlayLink from "./PlayLink.mjs";

export default class LastFm_PlaylistTrack {
  #payload;
  #playLinks = null;

  constructor(payload) {
    this.#payload = payload;
  }

  get url() {
    return this.#payload.url;
  }

  /**
   * @return {LastFm_PlayLink[]}
   */
  get playLinks() {
    return this.#playLinks ??= this.#createPlayLinks();
  }

  #createPlayLinks() {
    return this.#payload.playLinks.map((playLink) => new LastFm_PlayLink(playLink));
  }
}