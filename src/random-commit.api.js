import axios from "axios";

export default class RandomCommitAPI {
  async getRandomCommitMessage() {
    return await axios
      .get("https://whatthecommit.com/index.txt", {
        headers: {
          "Content-Type": "plain/text",
        },
      })
      .then((response) => {
        return String(response.data).replace("\n", "");
      });
  }
}
