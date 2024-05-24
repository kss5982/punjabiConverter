import axios from "axios";
const baseUrl = "/";

const create = async (newSearch) => {
  console.log("made it to service!", newSearch);
  //   const request = await axios.post(baseUrl, "sat");
  //   return request.then((response) => response.data);
  return newSearch;
};

export default { create };
