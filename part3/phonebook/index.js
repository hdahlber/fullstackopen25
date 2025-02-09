require("dotenv").config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
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


app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body
    
    

    if (!name || !number) {
        return response.status(400).json({ error: `Content missing: ${JSON.stringify(body.content)}` });

    }
    const person = new Person({
        name: name,
        number: number
    })

    person.save()
    .then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})



app.delete('/api/persons/:id', (request, response,next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error))
})


app.get('/api/persons/:id', (request, response,next) => {
    Person
        .findById(request.params.id)
        .then(person => { 
            if(person){
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch((error) => next(error))
})

app.get('/info',(request, response,next) => {
    const date = new Date()

    Person.find({})
    .then(Person => {
        response.send(`
            <div>
                <p>Phonebook has info for ${Person.length} people</p>
                <p>${date}</p>
            </div>
        `)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response,next) => {
    const { name, number } = request.body

    const person = {
        name: name,
        number: number
    }
    Person
        .findByIdAndUpdate(request.params.id,person,{ new :true })
        .then(updatedPerson => { 
            if(updatedPerson){
                response.json(updatedPerson)
            } else {
                response.status(404).end()
            }
        })
        .catch((error) => next(error))
})



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    //console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        console.error("Here " + error.message)
        return response.status(400).json({ error: error.message })
        } 
  
    next(error)
  }
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
