import React, { useState, useEffect } from 'react'
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Person from "./components/Person"
import personService from "./services/persons"
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter,setFilter] =useState("")
  const [newMessage, setMessage] = useState(null)
  const [isError,setIsError] = useState(false)

  const hook = () => {
    
    personService
        .getAll()
        .then(response => {
           
            console.log(response)
            setPersons(response)

        })
    } 
    useEffect(hook, [])
  
  


  const addPerson = (event) => {
    event.preventDefault()
    
   
    const personObject ={
      name: newName,
      number: newNumber,
    }
    personService
      .getAll()
      .then((response)=>{
        const nameExists = response.some((person) => person.name === newName)
      

        if (!nameExists){      
          personService
          .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            handleMessage(`Added ${personObject.name}`, false)
          })
          .catch(error =>{
            handleMessage(error.response.data.error, true)
          })
          
          
        }else if(
          window.confirm(`${newName} is already added to phonebook, replace old number?`)
        ){
          const user = response.find(person => person.name === newName)
          
          personService
          .update(user.id,personObject)
          .then(() => {
            return personService.getAll();
          })
          .then((responsePersons) => {
            setPersons(responsePersons)
            handleMessage(`Uppdated ${personObject.name} number to ${personObject.number}`, false)
          
          })
          .catch(() => {
            handleMessage(`Information of ${personObject.name} has already been removed from server`, true)
            setPersons(persons.filter(person => person.id !== id))
          })
      }
    })
    .catch((error) => {
      console.error('Error fetching persons:', error)
      handleMessage('Error fetching person list', true)
    })
}

const deletePerson = (id, name) => {
  if (window.confirm(`Delete ${name}?`)) {
    personService
      .getAll()
      .then((updatedPersons) => {
        const personStillExists = updatedPersons.some(person => person.id === id)

        if (!personStillExists) {
          handleMessage(`Information of ${name} has already been removed from server`, true)
          setPersons(updatedPersons)
          return
        }

        personService
          .remove(id)
          .then(() => personService.getAll())
          .then((finalUpdatedPersons) => {
            setPersons(finalUpdatedPersons || [])
            handleMessage(`Deleted ${name}`, false)
          })
          .catch((error) => {
            handleMessage(`Error deleting ${name}`, true)
            personService.getAll().then((finalUpdatedPersons) => setPersons(finalUpdatedPersons || []))
          })
      })
      .catch((error) => {
        handleMessage("Error fetching person list", true)
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
    setNewName("")
    setNewNumber("")
    setTimeout(() => {
      setMessage(null);
    }, 5000)
  }

  

  return (
    <div>
      

      <h2>Phonebook:</h2>
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
      {persons.map((persons) =>
        <Person key={persons.id} id={persons.id} name={persons.name} number={persons.number} deletePerson={deletePerson} />
        )
      }

    </div>
  )

}

export default App