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
// import { initGA, logPageView } from "./services/analytics.js";

const Home = ({
  convertText,
  text,
  handleTextChange,
  handleTextClick,
  selectedDropdown,
  handleDropDownClick,
  visible,
  finalText,
  copyText,
  handleCopyClick,
  divRef,
  position,
  isDisabled,
}) => {
  return (
    <div className="container text-center">
      <p className="description">
        <em>A Phonetic Panjabi to Gurmukhi Transliteration Tool</em>
      </p>
      <div className="row justify-content-center">
        <div className="col-md-5">
          <form onSubmit={convertText} className="textareaForms">
            <label className="frontLabel text-center" htmlFor="phonetic">
              Phonetic Panjabi
            </label>
            <textarea
              id="phonetic"
              className="frontTextarea form-control fs-3"
              value={text}
              onChange={handleTextChange}
              maxLength={2000}
              spellCheck="false"
              placeholder="ਇਸ ਖ਼ਾਨੇ ਵਿੱਚ ਅੰਗਰੇਜ਼ੀ ਲਿਪੀ ਵਾਲ਼ੀ ਪੰਜਾਬੀ ਟਾਈਪ ਕਰੋ ਜਾਂ ਕਾਪੀ/ਪੇਸਟ ਕਰੋ (ਜਿਵੇਂ ਕਿ sat sri akal) ਕਨਵਰਟ ਬਟਨ ਦੱਬਣ ਨਾਲ਼ ਲਿਖਤ ਗੁਰਮੁਖੀ 'ਚ ਬਦਲ ਜਾਵੇਗੀ। ਬਦਲੇ ਹੋਏ ਗੁਰਮੁਖੀ ਲਫ਼ਜ਼ 'ਤੇ ਕਲਿੱਕ ਕਰਕੇ (sat ਤੋਂ ਸਤਿ, ਸਤ, ਸੱਤ, ਸੱਟ) ਕੋਈ ਵੀ ਲਫ਼ਜ਼ ਚੁਣ ਸਕਦੇ ਹਾਂ।
Type or copy & paste Panjabi in this box (e.g. 'sat sri akal'), then press the 'Convert' button. Words in the other box can be clicked to show more variations."
              autoComplete="off"
              autoFocus
              required
            ></textarea>
            <button
              className="btn btn-primary frontBtn"
              type="submit"
              disabled={isDisabled}
            >
              {/* {isDisabled
                ? "Please Wait/ਸਬਰ ਕਰੋ ਜੀ"
                : "Convert/ਗੁਰਮੁਖੀ ਵਿੱਚ ਬਦਲੋ"} */}
              Convert/ਗੁਰਮੁਖੀ ਵਿੱਚ ਬਦਲੋ
            </button>
          </form>
        </div>
        <div className="col-md-5">
          <label htmlFor="converted" className="frontLabel">
            Gurmukhi Script
          </label>
          <textarea
            className="frontTextarea form-control fs-3"
            id="converted"
            value={finalText}
            onClick={handleTextClick}
            cols="30"
            rows="6"
            spellCheck="false"
            autoComplete="off"
            readOnly
          ></textarea>
          <button
            id="copy"
            className="btn btn-secondary frontBtn"
            type="button"
            onClick={handleCopyClick}
          >
            {copyText}
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
          <div className="row">
            <div className="col-auto ml-auto ms-auto">
              <button
                onClick={handleLogout}
                className="btn btn-danger logout btn-lg"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <form onSubmit={addToDictionary}>
                <div className="form-group">
                  <label htmlFor="dictPhone" className="backLabel">
                    Phonetic Word(s) to Add to Database
                  </label>
                  <textarea
                    className="backTextarea form-control"
                    value={dictText}
                    onChange={handleDictTextChange}
                    id="dictPhone"
                    cols="30"
                    rows="3"
                    spellCheck="false"
                    placeholder="List SPACE-SEPARATED phonetic words here ONLY"
                    autoComplete="off"
                    autoFocus
                    required
                  ></textarea>
                  <label htmlFor="dictConverted" className="backLabel">
                    Punjabi Word to Add to Database
                  </label>
                  <input
                    type="text"
                    id="dictConverted"
                    className="backInput form-control"
                    value={punjabiWord}
                    onChange={handlePunjabiTextChange}
                    autoComplete="off"
                    placeholder="Add 1 Punjabi word here"
                    required
                  ></input>
                  <button className="btn btn-primary addToMongo" type="submit">
                    Send to DB
                  </button>
                </div>
              </form>
            </div>

            <div className="col-md-6 my-auto">
              <p className="backLabel">
                Dictionary size: {allWords.length} words
              </p>
              {/* <button className="backButton" onClick={handleDictionaryLoad}>
                Load Dictionary
              </button> */}
              {"abcdefghijklmnopqrstuvwxyz*".split("").map((letter) => (
                <button
                  className="btn btn-secondary backButton"
                  onClick={handleDictionaryLoad}
                  key={letter}
                >
                  {letter.toUpperCase()}
                </button>
              ))}

              <label className="backLabel d-block" htmlFor="filter">
                Filter Words (Click a button letter first!)
              </label>
              <input
                className="backInput form-control"
                id="filter"
                value={filterWord}
                onChange={handleFilter}
                placeholder="Start typing a phonetic word here"
              />
              <p className="backLabel">
                Filtered words:{" "}
                {filterWord.length === 0 ? 0 : displayFilter.length} words
              </p>
              {filterWord !== "" && (
                <ul>
                  {displayFilter.map((word) => (
                    <li className="backLabel" key={word._id}>
                      <Link to={`/dictionary/${word._id}`}>
                        {word.phonetic}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* <div className="col-md-4 text-center my-auto">
              
            </div> */}
          </div>
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
      <h1 className="wordTitle">{dictWord.phonetic}</h1>
      <ul className="wordList">
        {dictWord &&
          dictWordConverted.map((word, index) => <li key={index}>{word}</li>)}
      </ul>
      <Link to={`/dictionary`}>
        <button
          className="btn btn-danger dltWord"
          onClick={() => deleteWord(match.params.id)}
        >
          Delete
        </button>
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
  const [copyText, setCopyText] = useState("Copy/ਪੰਜਾਬੀ ਕਾਪੀ ਕਰੋ");
  const [isCopied, setIsCopied] = useState(false);
  const [dropdownWord, setDropdownWord] = useState(""); // clicked dropdown word
  const [convertedIndex, setConvertedIndex] = useState(); // retains position of clicked word
  const [dropdownVisible, setDropdownVisible] = useState(false); // toggles dropdown div
  const divRef = useRef(null); // required for detecting clicks outside dropdown div
  // below are states used in the 'dictionary' portion of the site
  const [allWords, setLoadedWords] = useState([]);
  const [dictText, setDictText] = useState("");
  const [punjabiWord, setPunjabiWord] = useState("");
  const [dictWord, setDictWord] = useState({});
  const [dictWordConverted, setDictWordConverted] = useState([]);
  const [filterWord, setFilterWord] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDisabled, setIsDisabled] = useState(false);

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

  const convertText = (event) => {
    event.preventDefault();

    // disables button convert button for 5 seconds
    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000);

    // google analytics code to monitor text being converted
    if (window.gtag) {
      window.gtag("event", "convert_button", {
        event_category: "Engagement",
        event_label: "Convert Phonetic Punjabi",
        button_name: "convert_phonetic",
      });
    }

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
    // google analytics code to monitor text being clicked
    if (window.gtag) {
      window.gtag("event", "dropdown_menu", {
        event_category: "Engagement",
        event_label: "Dropdown Menu",
      });
    }
    // console.log(i)
    // stops dropdown menu from showing if clicking past last word
    if (i !== splitFinal.join(" ").length) {
      // console.log("textarea word:", getTextareaWordAndDropdown(i, finalText))
      setSelectedConverted(getTextareaWordAndDropdown(i));
      setDropdownVisible(true);
      const x = event.pageX || (event.touches && event.touches[0].pageX);
      const y = event.pageY || (event.touches && event.touches[0].pageY);
      setPosition({ x: x, y: y });
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
    setConvertedIndex(null); // resets clicked word index
    setDropdownWord(""); // resets dropdown word
  }, [dropdownWord]);

  // extracts value from dropdown menu
  const handleDropDownClick = (event) => {
    // google analytics code to monitor dropdown word being selected
    if (window.gtag) {
      window.gtag("event", "dropdown_word", {
        event_category: "Engagement",
        event_label: "Dropdown Word",
      });
    }
    // console.log("dropdown: value", event.target.textContent)
    setDropdownWord(event.target.textContent);
    // console.log("dropdown value:", dropdownWord)
    setDropdownVisible(false);
  };

  const handleCopyClick = async () => {
    if (splitFinal.join(" ") !== "") {
      // google analytics code to monitor text being copied
      if (window.gtag) {
        window.gtag("event", "copy_button", {
          event_category: "Engagement",
          event_label: "Copy Panjabi",
          button_name: "copy_panjabi",
        });
      }
      try {
        await navigator.clipboard.writeText(splitFinal.join(" "));
        setCopyText("Copied!/ਕਾਪੀ ਹੋਗਿਆ!");
        setIsCopied(true);

        // Revert button text after time has passed
        setTimeout(() => {
          setCopyText("Copy/ਪੰਜਾਬੀ ਕਾਪੀ ਕਰੋ");
          setIsCopied(false);
        }, 3500); // 3000 milliseconds = 3 seconds
      } catch (err) {
        console.error("Failed to copy text: ", err);
        // Optionally, set an error message on the button
        setCopyText("Error!");
        setTimeout(() => setCopyText("Copy"), 2000);
      }
    } else {
      alert("No text to copy");
    }
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

  const handleDictionaryLoad = (event) => {
    //this is the button's text value
    const buttonText = event.target.textContent.toLowerCase();
    setDictionary(buttonText);
  };

  const setDictionary = (buttonText) => {
    wordService
      .getDictionary(buttonText)
      .then((response) => {
        setLoadedWords(response);
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
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link className="nav-item nav-link beta" to="/">
              Beta
            </Link>
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
              convertText={convertText}
              text={text}
              finalText={splitFinal.join(" ")}
              handleTextChange={handleTextChange}
              handleTextClick={handleTextClick}
              selectedDropdown={selectedDropdown}
              handleDropDownClick={handleDropDownClick}
              copyText={copyText}
              handleCopyClick={handleCopyClick}
              visible={dropdownVisible}
              divRef={divRef}
              position={position}
              isDisabled={isDisabled}
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
