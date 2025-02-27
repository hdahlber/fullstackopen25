import { useState } from 'react'

const Blog = ({ blog , updateBlog, remove }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }
  const addLike = (event) => {
    event.preventDefault()
    //console.log(blog)
    //console.log(blog.id)

    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    updateBlog(blog.id, updatedBlog)
  }
  const removeBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      remove(blog.id)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return(
    <div style={blogStyle} className='blog'>
      <div className='blog-short'>
        <span className='blog-title'>{blog.title}</span>
        <span className='blog-author'>{blog.author}</span>
        <button onClick={toggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div className='blog-details'>
          <p className='blog-url'>{blog.url}</p>
          <p className='blog-likes'>likes {blog.likes} <button onClick={addLike}>like</button></p>
          <p className='blog-user'>{blog.user.name}</p>
          <p><button onClick={removeBlog}>remove</button></p>
        </div>
      )}
    </div>
  )
}


export default Blog