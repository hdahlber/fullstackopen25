import React, { useState, useEffect } from 'react'
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import personService from "./services/persons"
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter,setFilter] =useState("")
  const [newMessage, setMessage] = useState(null)
  const [isError,setIsError] = useState(false)


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons =>{
        setPersons(initialPersons)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.find(person => person.name === newName) !== undefined
    //console.log(nameExists);
    const personObject ={
      name: newName,
      number: newNumber,
    }
    if (!nameExists){
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        handleMessage(`Added ${personObject.name}`, false)
      })
      
      
    }
    else if (window.confirm(`${newName} is already added to phonebook, replace old number?`)){
      const user = persons.find(person => person.name === newName)
      
      personService
      .update(user.id,personObject)
      .then((response) => {
        const responsePerson = persons.map((person) =>
            person.id !== response.id ? person : response
        );
        setPersons(responsePerson)
        handleMessage(`Uppdated ${personObject.name} number to ${personObject.number}`, false)
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(() => {
        handleMessage(`Information of ${personObject.name} has already been removed from server`, true)
        setPersons(persons.filter(person => person.id !== id))
      })
      
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
      .remove(id)
      .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          handleMessage(`Deleted ${name}`, false)
      })
      .catch(() => {
        handleMessage(`Information of ${name} has already been removed from server`, true)
        setPersons(persons.filter(person => person.id !== id))
      })

    }
  }

  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    //console.log(event.target.value)
    setFilter(event.target.value)
  }
  const handleMessage = (message, isError = false) => {
    setMessage(message);
    setIsError(isError);

    setTimeout(() => {
      setMessage(null);
    }, 5000)
    setNewName("")
    setNewNumber("")
  }

  

  return (
    <div>
      

      <h2>Phonebook</h2>
      <Notification message={newMessage} isError={isError} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      

      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      

      <h3>Numbers</h3>
      <Persons 
        persons={persons} 
        newFilter={newFilter}
        deletePerson={deletePerson}
        />

    </div>
  )

}

export default App