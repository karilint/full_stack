const PersonForm = ({ onSubmit, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={onSubmit} id="addPerson">
      <div>
        name: 
        <input
          id="pname"
          value={newName}
          onChange={handleNameChange}
          placeholder="Enter new name..."
        />
      </div>
      <div>
        number: 
        <input
          id="pnumber"
          value={newNumber}
          onChange={handleNumberChange}
          placeholder="Enter new number..."
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
