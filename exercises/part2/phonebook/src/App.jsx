import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notification';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons'
import personService from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('Error happened...');
  const [feedbackType, setFeedbackType] = useState(null);

  console.log(persons)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    console.log('button clicked', event.target)
    console.log(`"${newName}", "${newNumber}" submitted`)
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    };

    // Check for existing number
    if (persons.some(person => person.number === newNumber)) {
      setFeedbackMessage(`"${newNumber}" is already added to phonebook`);
      setFeedbackType("error");
      setTimeout(() => setFeedbackMessage(''), 3000); // Clear the message after 3 seconds
      return;
    }

    const existingPerson = persons.find(p => p.name === newName);
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with this one?`)) {
        personService
          .update(existingPerson.id, { ...existingPerson, number: newNumber })
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson));
            setNewName('');
            setNewNumber('');

            // Success message after a number update
            setFeedbackMessage(`"${newNumber}" is updated to the phonebook`);
            setFeedbackType("success");
            setTimeout(() => setFeedbackMessage(''), 3000); // Clear the message after 3 seconds

          })
          .catch(error => {
            if (error.message === "PersonNotFound") {
                // Set error feedback message
                setFeedbackMessage(`Person ${existingPerson.name} has already been removed from the server. Please reload the page.`);
                setFeedbackType('error');
            } else {
                // Handle other types of errors
                setFeedbackMessage('An unexpected error occurred');
                setFeedbackType('error');
            }
        });
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          setFeedbackMessage('Error adding the person'); // Error message
          setFeedbackType("error");
          setTimeout(() => setFeedbackMessage(''), 3000); // Clear the message after 3 seconds
          console.error('Error adding the note:', error);
        });

        // Success message after add
        setFeedbackMessage(`"${newName}" was added to the phonebook`);
        setFeedbackType("success");
        setTimeout(() => setFeedbackMessage(''), 3000); // Clear the message after 3 seconds
  
    }
  };

  // on each entry change, keeps track on the entered value
  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id);
    if (person && window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
        });
        // Success message after delete
        setFeedbackMessage(`"${person.name}" was deleted from the phonebook`);
        setFeedbackType("success");
        setTimeout(() => setFeedbackMessage(''), 3000); // Clear the message after 3 seconds
        
    }
  };

  const personsToShow = searchQuery
    ? persons.filter(person =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : persons;

    return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={searchQuery} onChange={handleSearchChange} searchheading="filter shown with:" placeholder="Filter by name..."/>
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handlePersonChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      {feedbackMessage && <Notification message={feedbackMessage} type={feedbackType} />}
      <Persons persons={personsToShow} onDelete={deletePerson}/>
    </div>
  )
}

export default App