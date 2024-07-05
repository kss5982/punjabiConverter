import axios from "axios";
// const baseUrl = "/";

const convert = async (phoneticPunjabi) => {
  // console.log("in service", phoneticPunjabi);
  const response = await axios.post("/api", phoneticPunjabi);
  return response.data;
};

const getDictionary = async () => {
  // console.log("in service", phoneticPunjabi);
  const response = await axios.get("/api/dictionary");
  return response.data;
};

export default { convert, getDictionary };
