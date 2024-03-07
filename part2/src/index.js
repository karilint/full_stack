const express = require('express')
const app = express()

const mongoose = require('mongoose')
const password = process.argv[2]

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
//  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`
//  `mongodb+srv://karilintulaakso:${password}@phonebook.ebjpgj7.mongodb.net/?retryWrites=true&w=majority`
`mongodb+srv://karilintulaakso:h1bURTykIAWgmN3V@phonebook.ebjpgj7.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

// mongoose.connect(url)

mongoose.connect(url).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Error connecting to MongoDB:', error.message);
});

mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db');
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('Time: ', new Date().toISOString());
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)
app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

/*app.get('/api/notes', (req, res) => {
  res.json(notes)
})
*/

/*app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
*/

app.get('/api/notes', (request, response) => {
  Note.find({})
    .then(notes => {
      response.json(notes);
    })
    .catch(error => {
      console.error('Error fetching notes:', error.message);
      response.status(500).send({ error: 'server error' });
    });
});

/*
app.get('/api/notes', (request, response) => {
  console.log('Fetching notes...'); // Log at the beginning of the request handling

  Note.find({})
    .then(notes => {
      console.log('Notes fetched:', notes); // Log the fetched notes
      response.json(notes); // Send the notes as a JSON response
    })
    .catch(error => {
      console.error('Error fetching notes:', error.message); // Log any errors encountered
      response.status(500).send({ error: 'server error' }); // Send a server error response
    });
});
*/


const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }

  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
