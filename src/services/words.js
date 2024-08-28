import axios from "axios";
// const baseUrl = "/";

const convert = async (phoneticPunjabi) => {
  // console.log("in service", phoneticPunjabi);
  const response = await axios.post("/api", phoneticPunjabi);
  return response.data;
};

const addToDict = async (wordsToBeAdded) => {
  // console.log("in service", phoneticPunjabi);
  console.log("in axios:", wordsToBeAdded);
  const response = await axios.post("/api/dictionary", wordsToBeAdded);
  return response.data;
};

const getDictionary = async () => {
  // console.log("in service", phoneticPunjabi);
  const response = await axios.get("/api/dictionary");
  return response.data;
};

const getDictionaryWord = async (id) => {
  // console.log("in service", phoneticPunjabi);
  const response = await axios.get(`/api/dictionary/${id}`);
  return response.data;
};

const deleteDicWord = async (id) => {
  const response = await axios.delete(`/api/dictionary/${id}`);
  return response.data;
};

export default {
  convert,
  getDictionary,
  addToDict,
  getDictionaryWord,
  deleteDicWord,
};
