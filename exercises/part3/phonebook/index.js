// Environment Variables - Load first to ensure availability
require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// Morgan token for logging request bodies - define before using it in morgan middleware
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

// Morgan middleware in 'tiny' configuration - outputs minimal information
// Place logging middleware early to log all incoming requests, but after token definition
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Enable CORS for all routes
app.use(cors())

// Parse JSON bodies of incoming requests
app.use(express.json())

// Serve static files - placed after JSON parsing as static files don't need body parsing
app.use(express.static('dist'))

// Application routes
app.get('/', (request, response) => {
  response.send('<h1>Phonebook Home Page</h1>')
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const date = new Date()
    const infoContent = `
      <h1>Phonebook</h1>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    `
    response.send(infoContent)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {

  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => {
      console.log(error.message)
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {

  const body = request.body
  
  const person = {
    name: body.name,
    number: body.number,
  }

  // { new: true } parameter, which will cause our event handler to be called with the new modified document instead of the original.
  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => {
      console.log(error.message)
      next(error)
    })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Error 400: malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

// Custom Error Handling Middleware - placed at the end
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint
app.use(unknownEndpoint)


// Server setup
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
