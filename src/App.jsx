import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import wordService from './services/words.js'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'


const Home = ({ addText, text, handleTextChange, finalText }) => {
  return (
    <div className="row">
        <div className="col-md-6">
          <form onSubmit={addText}>
            <h5>Phonetic Punjabi</h5>
              <textarea value={text} onChange={handleTextChange} id="phonetic" cols="30" rows="8" maxLength="20480"  spellCheck="false" placeholder="sat sri akal!" autoComplete="off" autoFocus></textarea>
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

const Dictionary = ({ setDictionary, allWords }) => {
  //maybe useEffect to grab dictionary on click?
  if (allWords.length === 0) {
    useEffect(() => {
      setDictionary()
    }, [])
  }
  
  return (
    <>
      <p>Dictionary size: {allWords.length} words</p>
      <ul>
        {allWords.map(word => 
          <li key={word.id}>
            {word.phonetic}
          </li>
        )}
      </ul>
    </>
    // <h1>Hello!</h1>
  )
}

function App() {
  const [text, setText] = useState("")
  const [finalText, setFinalText] = useState("")
  const [allWords, setAllWords] = useState([])

  const addText = (event) => {
    event.preventDefault();
    const phoneticTextarea = {payload: text}
    wordService
      .convert(phoneticTextarea)
      .then(response => {
        console.log(response)
        setFinalText(response.converted)
      })
      .catch(error => console.log(error))
  }

  const handleTextChange = (event) => {
    console.log(event.target.value)
    setText(event.target.value)
  }

  const setDictionary = () => {
    
    wordService
    .getDictionary()
    .then(response => {
      setAllWords(response)
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
        <Route path="/dictionary" element={<Dictionary setDictionary={setDictionary} allWords={allWords}/>}/>
      </Routes>
    </Router>
  )
}


export default App
