require("dotenv").config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const PORT = process.env.PORT || 3001
const app = express()
const Person = require('./models/person')

app.use(morgan('combined'))
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))
morgan.token("info", (request) =>{
    return request.method ==="POST" ? JSON.stringify(request.body) :  request.method
})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(person => {
        response.json(person)
    })
})



app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => (error))
})


app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => { 
            if(person){
                response.json(person)
            }else{
                response.status(404).end()
            }
        })
        .catch((error) => (error))
})

app.get('/info',(request, response) => {
    const date = new Date()
    
    response.send(`
        <div>
            <p>Phonebook has info for ${Person.length} people</p>
            <p>${date}</p>
        </div>
    `)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
      })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
