  const Header =({ title }) =>{
    return(
        <h1>{title}</h1>
    )
  }
  const Part = ({ part }) => {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    )
  }
  const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part =>
                <Part key={part.id} part={part}/>)}
        </div>
    )
  }
  const Total =({ parts }) =>{
    const total = 
    parts.reduce((sum, part) => sum + part.exercises, 0)
    return(
        <b>Total of {total} exercises</b>
    )
  }
  const Course = ({ course }) => {
    return (
        <div>
            <Header title={course.name}></Header>
            <Content parts={course.parts}></Content>
            <Total parts={course.parts}></Total>
        </div>
    )
  }

  export default Course
