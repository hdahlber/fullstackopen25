import Person from "./Person"

const Persons = ({ persons, newFilter, deletePerson }) => {
    return (
        <div>
            {persons
                .filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
                .map(person => (
                    <Person 
                        key={person.id} 
                        id={person.id} 
                        name={person.name} 
                        number={person.number} 
                        deletePerson={deletePerson} 
                    />
                ))
            }
        </div>
    )
}

export default Persons
