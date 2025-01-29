import React, { useState, useEffect } from 'react'
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import axios from "axios"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter,setFilter] =useState("")



  useEffect(() => {
    console.log("effect")
    axios
      .get("http://localhost:3001/persons")
      .then(response => {
        console.log("promise fulfilled")
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.find(person => person.name === newName) !== undefined
    //console.log(nameExists);
    
    if (nameExists){
      window.alert(`${newName} is already added to phonebook`)
    }
    else{
      const personObject ={
        name: newName,
        number: newNumber,
        id: persons.length +1
      }
      axios
      .post("http://localhost:3001/persons",personObject)
      .then(response => {
      setPersons(persons.concat(personObject))
      setNewName("")
      setNewNumber("")
      }
      )
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

  return (
    <div>
      

      <h2>Phonebook</h2>
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
      <Persons persons={persons} newFilter={newFilter} />

    </div>
  )

}

export default App