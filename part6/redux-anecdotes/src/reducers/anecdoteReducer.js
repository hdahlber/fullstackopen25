const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {

  switch(action.type) {
    case 'GIVE_VOTE':{
      const id = action.payload.id
      const anecdoteToChange = state.find(n => n.id === id)
      const changedAnecdote = { 
        ...anecdoteToChange, 
        votes: anecdoteToChange.votes +1 
      }
      const updatedState =  state.map(note =>
        note.id !== id ? note : changedAnecdote
      )
      return updatedState.sort((a, b) => b.votes - a.votes)
    }
    case 'NEW_ANECDOTE':{
      const newState = [...state, action.payload]
      return newState.sort((a, b) => b.votes - a.votes)
    }
    default:
      return state
  }
}




export const giveVote = (id) => { 
  return {
    type: 'GIVE_VOTE',
    payload: { id }
  }
}

export const createAnecdote = (content) =>{
  return {
    type: 'NEW_ANECDOTE',
    payload: {
      content,
      id: getId(),
      votes: 0,
    }
  }
}

export default reducer