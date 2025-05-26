import axios from "axios";
// const baseUrl = "/";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const convert = async (phoneticPunjabi) => {
  // console.log("in service", phoneticPunjabi);
  const response = await axios.post("/api", phoneticPunjabi);
  return response.data;
};

const addToDict = async (wordsToBeAdded) => {
  // console.log("in service", phoneticPunjabi);
  const config = {
    headers: { Authorization: token },
  };
  console.log("in axios:", wordsToBeAdded);
  const response = await axios.post("/api/dictionary", wordsToBeAdded, config);
  return response.data;
};

const login = async (credentials) => {
  const response = await axios.post("/api/login", credentials);
  return response.data;
};

const getDictionary = async () => {
  const config = {
    headers: { Authorization: token },
  };
  // console.log("in service", phoneticPunjabi);
  const response = await axios.get("/api/dictionary", config);
  return response.data;
};

const getDictionaryWord = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  // console.log("in service", phoneticPunjabi);
  const response = await axios.get(`/api/dictionary/${id}`, config);
  return response.data;
};

const deleteDicWord = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`/api/dictionary/${id}`, config);
  return response.data;
};

export default {
  convert,
  getDictionary,
  addToDict,
  getDictionaryWord,
  deleteDicWord,
  login,
  setToken,
};
