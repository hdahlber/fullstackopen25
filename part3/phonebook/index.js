const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.post('/api/persons', (request, response) => {
    const randID = Number(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString()
    const { name, number } = request.body

    if (!name || !number) {
        return response.status(400).json({ error: "name and number are required" })
    }
    if (persons.some(person => person.name === name)){
        return response.status(400).json({ error: "name must be unique" })
    }

    const person = {
        id: randID,
        name,
        number
    }
    persons = persons.concat(person)
    response.json(person)
})


app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
    
})


app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person){
        response.json(person)
    } else{
        response.status(404).end()
    }
})

app.get('/info',(request, response) => {
    const date = new Date()
    const personsLength =  persons ? persons.length : 0
    response.send(`
        <div>
            <p>Phonebook has info for ${personsLength} people</p>
            <p>${date}</p>
        </div>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
