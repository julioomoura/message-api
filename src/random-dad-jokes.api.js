import axios from "axios";

export default class RandomCommitAPI {
  async getRandomCommitMessage() {
    return await axios
      .get("https://icanhazdadjoke.com/", {
        timeout: 1000,
      })
      .then((response) => {
        return response.data.joke;
      });
  }
}
