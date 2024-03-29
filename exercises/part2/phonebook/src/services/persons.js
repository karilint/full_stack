import axios from 'axios'
//const baseUrl = 'http://localhost:3001/persons'
//const baseUrl = 'http://localhost:3001/api/persons'
const baseUrl = '/api/persons'


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request
  .then(response => response.data)
  .catch(error => {
    console.log(error.message)
      if (error.response && error.response.status === 404) {
          throw new Error('PersonNotFound')
      } else {
          throw error; // other errors
      }
  })
}

const remove = id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { getAll, create, update, remove }
