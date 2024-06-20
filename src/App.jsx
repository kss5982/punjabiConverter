import { useState } from 'react'
import Navbar from './components/Navbar'
import wordService from './services/words.js'

function App() {
  const [text, setText] = useState("")
  const [finalText, setFinalText] = useState("")

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

  return (
    <>
      <Navbar />
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
    </>
  )
}


export default App
