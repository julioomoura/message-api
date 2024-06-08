import axios from "axios";

export default class RandomDadJokesAPI {
  async getRandomJoke(): Promise<string> {
    return await axios
      .get("https://icanhazdadjoke.com/", {
        timeout: 1000,
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        return response.data.joke;
      });
  }
}
