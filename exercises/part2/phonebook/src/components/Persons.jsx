import Person from './Person';

const Persons = ({ persons, onDelete }) => {

  return (
    <ul>
      {persons.map(person => (
        <Person
          key={person.id}       //unique id passed
          person={person}       //person object
          onDelete={onDelete}   //handler function passed
        />
      ))}
    </ul>
  );
};

export default Persons;
