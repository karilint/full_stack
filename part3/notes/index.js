require('dotenv').config()
const express = require('express')
const app = express()

//const mongoose = require('mongoose')
//const password = process.argv[2]
const Note = require('./models/note')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
// const url =
//  `mongodb+srv://karilintulaakso:${password}@phonebook.ebjpgj7.mongodb.net/noteApp?retryWrites=true&w=majority`

//mongoose.set('strictQuery',false)

// mongoose.connect(url)
/*
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

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
*/
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('Time: ', new Date().toISOString())
  console.log('---')
  next()
}


// MIDDLEWARE
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

const cors = require('cors')
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({})
    .then(notes => {
      response.json(notes)
    })
    .catch(error => {
      console.error('Error fetching notes:', error.message)
      response.status(500).send({ error: 'server error' })
    })
})

/*const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}
*/

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {

  const { content, important } = request.body

  Note.findByIdAndUpdate(
    request.params.id, 

    { content, important },
    { new: true, runValidators: true, context: 'query' }
  ) 
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

//const PORT = process.env.PORT || 3001
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
