import { useState, useEffect } from 'react'
import Note from './components/Note'
import Footer from './components/Footer'
import noteService from './services/notes'
import './index.css'

const App = () => {
//  const [notes, setNotes] = useState([])
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState(
    'enter a new note...'
  ) 
  const [showAll, setShowAll] = useState(true)
  const [feedbackMessage, setFeedbackMessage] = useState('');

  console.log(notes)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // do not render anything if notes is still null
  if (!notes) { 
    return null 
  }
  
  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='error'>
        {message}
      </div>
    )
  }

  const addNote = (event) => {
    console.log('button clicked', event.target)
    event.preventDefault();

    // Trim to remove any leading/trailing white spaces
    const noteContent = newNote.trim();

    // Check for empty note
    if (noteContent === '' || noteContent === 'enter a new note...') {
      setFeedbackMessage('Please enter a note');
      setTimeout(() => setFeedbackMessage(''), 3000); // Clear the message after 3 seconds
      return;
    }

    // Check for duplicate notes (case-insensitive)
    const isDuplicate = notes.some(note => 
      note.content.toLowerCase() === noteContent.toLowerCase()
    );
    
    if (isDuplicate) {
      setFeedbackMessage('Duplicate note detected');
      setTimeout(() => setFeedbackMessage(''), 3000); // Clear the message after 3 seconds
      return;
    }

    noteService
      .create({ content: noteContent, important: Math.random() < 0.5 })
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
        setNewNote('enter a new note...');
        setFeedbackMessage('Note added successfully');
        setTimeout(() => setFeedbackMessage(''), 3000); // Clear the message after 3 seconds
      })
      .catch(error => {
        setFeedbackMessage('Error adding the note');
        setTimeout(() => setFeedbackMessage(''), 3000); // Clear the message after 3 seconds
        console.error('Error adding the note:', error);
      });
  };
  
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
      noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setFeedbackMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setFeedbackMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
    console.log(`importance of ${id} updated`)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
       {notesToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul> 
      {feedbackMessage && <Notification message={feedbackMessage} />}
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App