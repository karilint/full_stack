const express = require('express')
const morgan = require('morgan');

const app = express()

// Morgan middleware in 'tiny' configuration - outputs minimal information
// app.use(morgan('tiny'));
app.use(express.json())

// To make express show static content, the page index.html and the JavaScript, etc.
app.use(express.static('dist'))

// https://github.com/expressjs/morgan#creating-new-tokens
// morgan.token('type', function (req, res) { return req.headers['content-type'] })

morgan.token('body', function (req, res) {return JSON.stringify(req.body);});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const cors = require('cors')
app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook Home Page</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date();
  const infoContent = `
    <h1>Phonebook</h1>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `;
  response.send(infoContent);
});

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)    
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

// generates a random number and then checks if the id already exists
function generateId() {
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000000);
  } while (persons.find(person => person.id === newId));

  return newId;
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  // Check if the name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' });
  }

  // Check if the name already exists
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  response.json(person)
})

//const PORT = 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})