const Person = ({ id,name,number, deletePerson }) => {
    return (
        <li>
            {name} {number}
            <button onClick={() => deletePerson(id,name)}>delete </button>
        </li>

    )
}
export default Person