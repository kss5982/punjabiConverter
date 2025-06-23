import { useState, useEffect, useRef } from "react";
// import Navbar from './components/Navbar'
import wordService from "./services/words.js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
  Navigate,
} from "react-router-dom";

const Home = ({
  addText,
  text,
  handleTextChange,
  handleTextClick,
  selectedDropdown,
  handleDropDownClick,
  visible,
  finalText,
  divRef,
  position,
}) => {
  return (
    <div className="container text-center">
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={addText} className="textareaForms">
            <label className="frontLabel text-center" htmlFor="phonetic">
              Phonetic Punjabi
            </label>
            <textarea
              id="phonetic"
              className="phoneticText form-control fs-2"
              value={text}
              onChange={handleTextChange}
              maxLength="20480"
              spellCheck="false"
              placeholder="sat sri akal!"
              autoComplete="off"
              autoFocus
              required
            ></textarea>
            <button className="btn btn-primary frontBtn" type="submit">
              Convert Punjabi!
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <label htmlFor="converted" className="frontLabel">
            Converted Punjabi
          </label>
          <textarea
            className="convertedText form-control fs-2"
            id="converted"
            value={finalText}
            onClick={handleTextClick}
            cols="30"
            rows="6"
            placeholder="ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ!"
            spellCheck="false"
            autoComplete="off"
            readOnly
          ></textarea>
          <button
            id="copy"
            className="btn btn-secondary frontBtn"
            type="button"
            onClick={() => navigator.clipboard.writeText(finalText)}
          >
            Copy Punjabi/ਪੰਜਾਬੀ ਕਾਪੀ ਕਰੋ
          </button>
          <div
            ref={divRef}
            style={{
              width: "fit-content",
              top: position.y + 10,
              left: position.x - 10,
            }}
            className="dropdownContainer"
          >
            {visible &&
              selectedDropdown &&
              selectedDropdown.map((dropDownItem, i) => (
                <div
                  className="dropdownItem fs-2"
                  key={i}
                  onClick={handleDropDownClick}
                >
                  <strong>{dropDownItem}</strong>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dictionary = ({
  handleDictionaryLoad,
  allWords,
  addToDictionary,
  handleDictTextChange,
  dictText,
  handlePunjabiTextChange,
  punjabiWord,
  filterWord,
  handleFilter,
  displayFilter,
  handleLogin,
  handleLogout,
  handleUserChange,
  handlePassChange,
  username,
  password,
  user,
}) => {
  //maybe useEffect to grab dictionary on click?
  // useEffect(() => {
  //   setDictionary();
  // }, []);

  return (
    <>
      {user === null && (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
          <form onSubmit={handleLogin} className="login">
            <div className="form-group mb-4">
              <label htmlFor="inputUsername"></label>
              <input
                type="text"
                value={username}
                onChange={handleUserChange}
                name="Username"
                className="form-control user-pass"
                id="inputUsername"
                aria-describedby="usernameHelp"
                placeholder="Username"
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="inputPassword"></label>
              <input
                type="password"
                value={password}
                name="Password"
                onChange={handlePassChange}
                className="form-control user-pass"
                id="inputPassword"
                placeholder="Password"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              login
            </button>
          </form>
        </div>
      )}
      {user !== null && (
        <div className="container">
          <button
            onClick={handleLogout}
            className="btn btn-danger logout btn-lg float-end"
          >
            Logout
          </button>

          <div className="row">
            <form onSubmit={addToDictionary}>
              <div className="form-group col-md-6">
                <label htmlFor="dictPhone">Phonetic Word(s)</label>
                <textarea
                  className="form-control"
                  value={dictText}
                  onChange={handleDictTextChange}
                  id="dictPhone"
                  cols="30"
                  rows="3"
                  spellCheck="false"
                  placeholder="add space-separated phonetic words here"
                  autoComplete="off"
                  autoFocus
                ></textarea>
                <label htmlFor="dictConverted">Punjabi Word</label>
                <input
                  type="text"
                  id="dictConverted"
                  value={punjabiWord}
                  onChange={handlePunjabiTextChange}
                  autoComplete="off"
                  placeholder="add 1 Punjabi word here"
                  required
                ></input>
                <button type="submit">Send to DB</button>
              </div>
            </form>
          </div>

          <button onClick={handleDictionaryLoad}>Load Dictionary</button>
          <p>Dictionary size: {allWords.length} words</p>
          <label htmlFor="filter">Filter Dictionary</label>
          <input id="filter" value={filterWord} onChange={handleFilter} />
          <p>
            Filtered words: {filterWord.length === 0 ? 0 : displayFilter.length}{" "}
            words
          </p>
          {filterWord !== "" && (
            <ul>
              {displayFilter.map((word) => (
                <li key={word._id}>
                  <Link to={`/dictionary/${word._id}`}>{word.phonetic}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

const Word = ({ getOneWord, dictWord, dictWordConverted, deleteWord }) => {
  const match = useMatch("/dictionary/:id");
  useEffect(() => {
    getOneWord(match.params.id);
  }, []);
  return (
    <>
      <h1>{dictWord.phonetic}</h1>
      <ul>
        {dictWordConverted.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
      <Link to={`/dictionary`}>
        <button onClick={() => deleteWord(match.params.id)}>Delete</button>
      </Link>
    </>
  );
};

function App() {
  const [text, setText] = useState(""); // phonetic punjabi string
  // const [finalText, setFinalText] = useState("") // complete converted string
  const [splitFinal, setSplitFinal] = useState([]); // converted strings in array
  const [dropdownList, setDropdownList] = useState([]); // list of all dropdown arrays in an array
  const [selectedConverted, setSelectedConverted] = useState(""); // clicked converted word
  const [selectedDropdown, setSelectedDropdown] = useState([]); // selected dropdown menu
  const [dropdownWord, setDropdownWord] = useState(""); // clicked dropdown word
  const [convertedIndex, setConvertedIndex] = useState(); // retains position of clicked word
  const [dropdownVisible, setDropdownVisible] = useState(false); // toggles dropdown div
  const divRef = useRef(null); // required for detecting clicks outside dropdown div
  // below are states used in the 'dictionary' portion of the site
  const [allWords, setAllWords] = useState([]);
  const [dictText, setDictText] = useState("");
  const [punjabiWord, setPunjabiWord] = useState("");
  const [dictWord, setDictWord] = useState({});
  const [dictWordConverted, setDictWordConverted] = useState([]);
  const [filterWord, setFilterWord] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedViakaranUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      wordService.setToken(user.token);
    }
  }, []);

  // renderes final converted text
  useEffect(() => {}, [splitFinal]);

  const addText = (event) => {
    event.preventDefault();
    const phoneticTextarea = { payload: text };
    wordService
      .convert(phoneticTextarea)
      .then((response) => {
        console.log(response);
        setSplitFinal(response.splitFinal);
        // setFinalText(response.converted)
        setDropdownList(response.dropdowns);
      })
      .catch((error) => console.log(error));
  };

  const handleTextChange = (event) => {
    console.log(event.target.value);
    setText(event.target.value);
  };

  // selected dropdown menu is properly rendered as state variable
  useEffect(() => {
    console.log("selected dropdown: ", selectedDropdown);
  }, [selectedDropdown]);

  // selected dropdown menu is properly rendered as state variable
  useEffect(() => {
    console.log("index in list of dropdowns: ", convertedIndex);
  }, [convertedIndex]);

  // returns proper dropdown menu from clicked word
  const getDropdownMenuAndIndex = (index) => {
    setSelectedDropdown(dropdownList[index]);
    setConvertedIndex(index);
    return dropdownList[index];
  };

  // uses clicked word to find the relevant dropdown menu
  const getTextareaWordAndDropdown = (selectionStart) => {
    let sum = 0;
    for (let i = 0; i < splitFinal.length; i++) {
      sum += splitFinal[i].length + 1;
      if (sum > selectionStart) {
        getDropdownMenuAndIndex(i);
        // checks if clicked word has punctuation mark
        for (let y = 0; y < splitFinal[i].length; y++) {
          if (
            "!@#$%^&*()-_=+[{]};:'\",<.>/?\\|".indexOf(splitFinal[i][y]) !== -1
          ) {
            console.log("String has a special character!");
          }
        }
        return splitFinal[i];
      }
    }
  };

  // selected converted word is properly rendered as state variable
  useEffect(() => {
    console.log("textarea converted word:", selectedConverted);
  }, [selectedConverted]);

  // identifies clicked word from textarea
  const handleTextClick = (event) => {
    let i = event.target.selectionStart;
    // console.log(i)
    // stops dropdown menu from showing if clicking past last word
    if (i !== splitFinal.join(" ").length) {
      // console.log("textarea word:", getTextareaWordAndDropdown(i, finalText))
      setSelectedConverted(getTextareaWordAndDropdown(i));
      setDropdownVisible(true);
      setPosition({ x: event.clientX, y: event.clientY });
    }
  };

  // used for making dropdown disappear
  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  // required for making dropdown disappear when clicking outside of it
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // renders list of dropdowns
  useEffect(() => {}, [dropdownList]);

  const swapWordFromDropdown = (index, dropdownWord) => {
    let specialRegex = "\n~!@#$%^&*()-_=+[{]};:'\",<.>/?\\|";
    let copySplitFinal = [...splitFinal];
    let copyAllDropdowns = [...dropdownList];
    let copyDropdownMenu = [...selectedDropdown];
    let dropdownPosition = copyDropdownMenu.indexOf(dropdownWord);

    // checks if clicked word has punctuation mark
    let puncExists = false;
    for (let i = 0; i < selectedConverted.length; i++) {
      if (specialRegex.indexOf(selectedConverted[i]) !== -1) {
        console.log("String has a special character!");
        puncExists = true;
        break;
      }
    }

    if (puncExists) {
      // converts clicked word into char array and used for splice (will only have punctuation)
      let copySelected = Array.from(selectedConverted.split(""));
      console.log("copy selected:", copySelected);
      // collects non-special characters to form string
      let onlyString = [];
      let firstOccurrence = null;
      for (let i = 0; i < selectedConverted.split("").length; i++) {
        if (!specialRegex.includes(selectedConverted.split("")[i])) {
          if (firstOccurrence == null) {
            firstOccurrence = i;
          }
          console.log(
            "copy selected index value:",
            selectedConverted.split("")[i]
          );
          console.log("index:", i);
          onlyString.push(
            copySelected.splice(
              copySelected.indexOf(selectedConverted.split("")[i]),
              1
            )
          );
        }
      }

      // replaces word in converted textarea w/ dropdown word
      console.log(index, dropdownWord);
      copySelected.splice(firstOccurrence, 0, dropdownWord);
      copySplitFinal[index] = copySelected.join("");
      console.log("copySplitFinal: ", copySplitFinal);

      // replaces selected dropdown word with original converted word minus punctuation
      copyDropdownMenu.splice(dropdownPosition, 1);
      copyDropdownMenu.splice(0, 0, onlyString.join(""));
      console.log("copyDropdownMenu: ", copyDropdownMenu);

      // console.log("only string:", onlyString.join(""));
      // console.log("copy selected", copySelected.join(""));
      // console.log("first occurence of non-special char:", firstOccurrence);
      // let convertedSplice = copySelected.splice(0, puncIndex);
      // console.log("remaining punctuation:", copySelected);
      // console.log("convertedSplice:", convertedSplice.join(""));
    } else {
      // replaces word in converted textarea w/ dropdown word
      console.log(index, dropdownWord);
      copySplitFinal[index] = dropdownWord;
      console.log("copySplitFinal: ", copySplitFinal);

      // replaces selected dropdown word with original converted word
      copyDropdownMenu.splice(dropdownPosition, 1);
      copyDropdownMenu.splice(0, 0, selectedConverted);
      // copyDropdownMenu[dropdownPosition] = selectedConverted;
      console.log("copyDropdownMenu: ", copyDropdownMenu);
    }

    // updates list of dropdowns to reflect change in selected dropdown
    copyAllDropdowns[convertedIndex] = copyDropdownMenu;
    console.log("copyAllDropdowns: ", copyAllDropdowns);
    setSplitFinal(copySplitFinal);
    setDropdownList(copyAllDropdowns);
  };

  // selected dropdown word is properly rendered as state variable
  useEffect(() => {
    console.log("selected dropdown word:", dropdownWord);
    swapWordFromDropdown(convertedIndex, dropdownWord);
  }, [dropdownWord]);

  // extracts value from dropdown menu
  const handleDropDownClick = (event) => {
    // console.log("dropdown: value", event.target.textContent)
    setDropdownWord(event.target.textContent);
    // console.log("dropdown value:", dropdownWord)
    setDropdownVisible(false);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await wordService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedViakaranUser", JSON.stringify(user));
      wordService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      alert("Wrong credentials");
    }
  };

  const handleLogout = (event) => {
    window.localStorage.clear();
    window.location.reload();
  };

  const handleUserChange = (event) => {
    console.log(event.target.value);
    setUsername(event.target.value);
  };

  const handlePassChange = (event) => {
    console.log(event.target.value);
    setPassword(event.target.value);
  };

  const handleDictTextChange = (event) => {
    console.log(event.target.value);
    setDictText(event.target.value);
  };

  const handlePunjabiTextChange = (event) => {
    console.log(event.target.value);
    setPunjabiWord(event.target.value);
  };

  const handleDictionaryLoad = () => {
    setDictionary();
  };

  const setDictionary = () => {
    wordService
      .getDictionary()
      .then((response) => {
        setAllWords(response);
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  const getOneWord = async (id) => {
    console.log("id:", id);
    await wordService
      .getDictionaryWord(id)
      .then((response) => {
        setDictWord(response);
        setDictWordConverted(response.converted);
        console.log("response 1 word:", response);
      })
      .catch((error) => console.log(error));
  };

  const handleFilter = (event) => {
    console.log(event.target.value);
    setFilterWord(event.target.value);
  };

  const filterList = (words, criteria) => {
    const filtered = words.filter((word) =>
      word.phonetic.toLowerCase().startsWith(criteria.toLowerCase())
    );
    return filtered;
  };
  let displayFilter = filterList(allWords, filterWord);

  const deleteWord = async (id) => {
    console.log("id:", id);
    await wordService
      .deleteDicWord(id)
      .then((response) => {
        console.log("deleted word:", response);
      })
      .catch((error) => console.log(error));
  };

  const addToDictionary = (event) => {
    event.preventDefault();
    setDictText("");
    setPunjabiWord("");

    const toBeAdded = {
      phonetic: event.target[0].value,
      converted: event.target[1].value,
    };
    wordService
      .addToDict(toBeAdded)
      .then((response) => {
        console.log(response);
        // setDictText(response.converted)
      })
      .catch((error) => console.log(error));
  };

  return (
    <Router>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        {/* <a className="navbar-brand" href="/">Viakaran</a> */}
        <Link className="navbar-brand" to="/">
          Viakaran
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-item nav-link beta" href="/">
              Beta<span className="sr-only"></span>
            </a>
          </div>
          <div className="navbar-nav ms-auto">
            {/* <a className="nav-item nav-link" href="/bob">Admin<span className="sr-only"></span></a> */}
            <Link className="nav-item nav-link" to="/dictionary">
              Dictionary
            </Link>
          </div>
        </div>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              addText={addText}
              text={text}
              finalText={splitFinal.join(" ")}
              handleTextChange={handleTextChange}
              handleTextClick={handleTextClick}
              selectedDropdown={selectedDropdown}
              handleDropDownClick={handleDropDownClick}
              visible={dropdownVisible}
              divRef={divRef}
              position={position}
            />
          }
        />
        <Route
          path="/dictionary"
          element={
            <Dictionary
              handleDictionaryLoad={handleDictionaryLoad}
              addToDictionary={addToDictionary}
              allWords={allWords}
              dictText={dictText}
              handleDictTextChange={handleDictTextChange}
              handlePunjabiTextChange={handlePunjabiTextChange}
              punjabiWord={punjabiWord}
              filterWord={filterWord}
              handleFilter={handleFilter}
              displayFilter={displayFilter}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
              handleUserChange={handleUserChange}
              handlePassChange={handlePassChange}
              username={username}
              password={password}
              user={user}
            />
          }
        />
        <Route
          path="/dictionary/:id"
          element={
            <Word
              getOneWord={getOneWord}
              dictWord={dictWord}
              dictWordConverted={dictWordConverted}
              deleteWord={deleteWord}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
