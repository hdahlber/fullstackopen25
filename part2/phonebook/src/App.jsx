import { useState } from 'react'
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter,setFilter] =useState("")
  const filterNames = persons.filter(person => person.name.toLowerCase().includes(newFilter))

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

      setPersons(persons.concat(personObject))
      setNewName("")
      setNewNumber("")
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