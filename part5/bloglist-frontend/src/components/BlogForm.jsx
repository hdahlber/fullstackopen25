import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title,setTitle] = useState('')
  const [author,setAuthor] = useState('')
  const [url,setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')

  }


  return (
    <div>
      <form onSubmit={addBlog}>
        <h2>create new: </h2>
        <div>
        title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={event => setTitle(event.target.value)}
            placeholder="Title"
          />
        </div>
        <div>
        author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={event => setAuthor(event.target.value)}
            placeholder="Author"
          />
        </div>
        <div>
      url:
          <input
            type="text"
            value={url}
            name="Url"
            onChange={event => setUrl(event.target.value)}
            placeholder="Url"
          />
        </div>
        <button type="submit">create a new blog</button>
      </form>
    </div>

  )
}

export default BlogForm
