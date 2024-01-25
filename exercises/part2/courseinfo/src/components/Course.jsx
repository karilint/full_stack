const Course = ({course}) => {
//  console.log({course})
  const parts = course.parts

  // Function to calculate the total number of exercises
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <div>
      <h2>{course.name}</h2>
      <table>
        <thead>
          <tr>
            <th>Part</th>
            <th>Exercises</th>
          </tr>
        </thead>
        <tbody>
          {parts.map(part => (
            <tr key={part.id}>
              <td>{part.name}</td>
              <td>{part.exercises}</td>
            </tr>
          ))}
          {/* Row for total number of exercises */}
          <tr>
            <td><strong>Total:</strong></td>
            <td><strong>{totalExercises}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
export default Course