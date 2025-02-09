const Person = ({ id,name,number, deletePerson }) => {
    return (
        <div>
            {name} {number}
            <button onClick={() => deletePerson(id,name)}>delete </button>
        </div>

    )
}
export default Person