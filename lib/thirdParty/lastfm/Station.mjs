import LastFm_Playlist from "./Playlist.mjs";

export default class LastFm_Station {
  /**
   * @type {LastFm_Playlist}
   */
  #playlist;
  #currentTrack;

  constructor({playlist}) {
    this.#playlist = new LastFm_Playlist(playlist);
  }

  get size() {
    return this.#playlist.size;
  }

  current() {
    return this.#playlist.current();
  }

  next() {
    return this.#playlist.next();
  }

  reset() {
    this.#playlist.reset();
  }

  static async getRecommended(username) {
    const response = await this.#getStation({
      type: 'recommended',
      username
    });

    return new this(await response.json());
  }

  /**
   * @param {string} type
   * @param {string} username
   * @return {Promise<Response>}
   */
  static async #getStation({type, username}) {
    return await this.#send(
      'GET',
      `/player/stations/user/${username}/${type}`,
      {
        page: 1,
        ajax: 1
      }
    )
  }

  /**
   * @param {string} method
   * @param {string} path
   * @param {Object} fields
   * @return {Promise<Response>}
   */
  static async #send(method = 'GET', path = '/', fields = {}) {
    let body = null;

    if (fields) {
      body = new URLSearchParams(fields);
    }

    return await fetch(this.#baseUrl + path, {
      method,
      body
    });
  }

  static #baseUrl = 'https://last.fm'
}