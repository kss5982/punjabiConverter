import { useState, useEffect } from 'react'
// import Navbar from './components/Navbar'
import wordService from './services/words.js'
import { BrowserRouter as Router, Routes, Route, Link, useMatch, Navigate } from 'react-router-dom'


const Home = ({ addText, text, handleTextChange, finalText }) => {
  return (
    <div className="row">
        <div className="col-md-6">
          <form onSubmit={addText}>
            <h5>Phonetic Punjabi</h5>
              <textarea value={text} onChange={handleTextChange} cols="30" rows="8" maxLength="20480"  spellCheck="false" placeholder="sat sri akal!" autoComplete="off" autoFocus></textarea>
              <button type='submit'>Convert Phonetic!</button>
          </form>
        </div>
        <div className="col-md-6 dropdown">
          <h5>Converted Punjabi</h5>
            <textarea value={finalText} cols="30" rows="8" placeholder="ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ!" spellCheck="false" autoComplete="off" readOnly ></textarea>
            {/* <div id="myDropdown" className="dropdown-content"></div> */}
        </div>
        {/* <button id="copy">Copy Panjabi/ਪੰਜਾਬੀ ਕਾਪੀ ਕਰੋ</button> */}
      </div>
  )
}

const Dictionary = ({ setDictionary, allWords, addToDictionary, handleDictTextChange, dictText, handlePunjabiTextChange, punjabiWord, filterWord, handleFilter, displayFilter}) => {
  //maybe useEffect to grab dictionary on click?
  useEffect(() => {
    setDictionary()
  }, [])
  
  return (
    <>
      <div className='row'>
        <form onSubmit={addToDictionary}>
          <label htmlFor="dictPhone">Phonetic Word(s)</label>
          <textarea value={dictText} onChange={handleDictTextChange} id="dictPhone" cols="30" rows="8" spellCheck="false" placeholder="add space-separated phonetic words here" autoComplete="off" autoFocus></textarea>
          <label htmlFor="dictConverted">Punjabi Word</label>
          <input type="text" id="dictConverted" value={punjabiWord} onChange={handlePunjabiTextChange} autoComplete="off" required></input>
          <button type="submit">Send to DB</button>
        </form>
      </div>
      <p>Dictionary size: {allWords.length} words</p>
      <label htmlFor='filter'>Filter Dictionary</label>
      <input id='filter' value={filterWord} onChange={handleFilter}/>
      <p>Filtered words: {filterWord.length === 0 ? 0 : displayFilter.length} words</p>
      {filterWord !== "" &&<ul>
        {displayFilter.map(word =>
          <li key={word._id}>
            <Link to={`/dictionary/${word._id}`}>{word.phonetic}</Link>
          </li>
        )}
      </ul>}
    </>
  )
}

const Word = ({getOneWord, dictWord, dictWordConverted, deleteWord}) => {
  const match = useMatch('/dictionary/:id')
  useEffect(() => {
    getOneWord(match.params.id)
  }, [])
  return(
    <>
      <h1>{dictWord.phonetic}</h1>
      <ul>
        {dictWordConverted.map((word, index) => 
          <li key={index}>{word}</li>
        )} 
      </ul>
      <Link to={`/dictionary`}><button onClick={() => deleteWord(match.params.id)}>Delete</button></Link>
    </>
  )
}

function App() {
  const [text, setText] = useState("")
  const [finalText, setFinalText] = useState("")
  const [allWords, setAllWords] = useState([])
  const [dictText, setDictText] = useState("")
  const [punjabiWord, setPunjabiWord] = useState("")
  const [dictWord, setDictWord] = useState({})
  const [dictWordConverted, setDictWordConverted] = useState([])
  const [filterWord, setFilterWord] = useState("")
  const [dropdown, setDropdown] = useState([])

  const addText = (event) => {
    event.preventDefault();
    const phoneticTextarea = {payload: text}
    wordService
      .convert(phoneticTextarea)
      .then(response => {
        console.log(response)
        setFinalText(response.converted)
        setDropdown(response.dropdown)
      })
      .catch(error => console.log(error))
  }

  const handleTextChange = (event) => {
    console.log(event.target.value)
    setText(event.target.value)
  }

  const handleDictTextChange = (event) => {
    console.log(event.target.value)
    setDictText(event.target.value)
  }

  const handlePunjabiTextChange = (event) => {
    console.log(event.target.value)
    setPunjabiWord(event.target.value)
  }

  const setDictionary = () => {
    wordService
    .getDictionary()
    .then(response => {
      setAllWords(response)
      console.log(response)
    })
    .catch(error => console.log(error))
  }

  const getOneWord = async (id) => {
    console.log("id:", id)
    await wordService
    .getDictionaryWord(id)
    .then(response => {
      setDictWord(response)
      setDictWordConverted(response.converted)
      console.log("response 1 word:", response)
    })
    .catch(error => console.log(error))
  }
  
  const handleFilter = (event) => {
   console.log(event.target.value)
   setFilterWord(event.target.value)
  }

  const filterList = (words, criteria) => {
    const filtered = words.filter(word => word.phonetic.toLowerCase().startsWith(criteria.toLowerCase()));
    return filtered;
  }
  let displayFilter = filterList(allWords, filterWord)

  const deleteWord = async (id) => {
    console.log("id:", id)
    await wordService
    .deleteDicWord(id)
    .then(response => {
      console.log("deleted word:", response)
    })
    .catch(error => console.log(error))
  }

  const addToDictionary = (event) => {
    event.preventDefault();
    setDictText("")
    setPunjabiWord("")

    const toBeAdded = {
      phonetic: event.target[0].value,
      converted: event.target[1].value,
    }
    wordService
      .addToDict(toBeAdded)
      .then(response => {
        console.log(response)
        // setDictText(response.converted)
      })
      .catch(error => console.log(error))
  }

  return (
    <Router>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        {/* <a className="navbar-brand" href="/">Viakaran</a> */}
        <Link className="navbar-brand" to='/'>Viakaran</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-item nav-link" href="/help">Help<span className="sr-only"></span></a>
          </div>
          <div className="navbar-nav ms-auto">
            {/* <a className="nav-item nav-link" href="/bob">Admin<span className="sr-only"></span></a> */}
            <Link className="nav-item nav-link" to='/dictionary'>Dictionary</Link>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home addText={addText} text={text} handleTextChange={handleTextChange} finalText={finalText}/>} />
        <Route path="/dictionary" element={<Dictionary setDictionary={setDictionary} addToDictionary={addToDictionary} allWords={allWords} dictText={dictText} handleDictTextChange={handleDictTextChange} handlePunjabiTextChange={handlePunjabiTextChange} punjabiWord={punjabiWord} filterWord={filterWord} handleFilter={handleFilter} displayFilter={displayFilter}/>} />
        <Route path="/dictionary/:id" element={<Word getOneWord={getOneWord} dictWord={dictWord} dictWordConverted={dictWordConverted} deleteWord={deleteWord}/>}/>
      </Routes>
    </Router>
  )
}


export default App
