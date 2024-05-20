import axios from "axios";

export default class RandomDadJokesAPI {
  async getRandomJoke() {
    return await axios
      .get("https://icanhazdadjoke.com/", {
        timeout: 1000,
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        return response.data.joke;
      });
  }
}
