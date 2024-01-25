const Filter = ({ value, onChange, searchheading, placeholder }) => {
  return (
    <div>
      {searchheading} 
      <input value={value} onChange={onChange} placeholder={placeholder}/>
    </div>
  );
};

export default Filter;