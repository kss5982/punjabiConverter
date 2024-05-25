import axios from "axios";
const baseUrl = "/";

const convert = async (phoneticPunjabi) => {
  // console.log("in service", phoneticPunjabi);
  const response = await axios.post(baseUrl, phoneticPunjabi);
  return response.data;
};

export default { convert };
