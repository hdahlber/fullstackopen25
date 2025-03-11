import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newMessage, setMessage] = useState(null)
  const [isError,setIsError] = useState(false)
  const blogFormRef = useRef()



  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      handleMessage('Success login', false)
    } catch (exception) {
      handleMessage('Wrong credentials', true)
    }

  }
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        const completeBlog = { ...returnedBlog, user }
        setBlogs(blogs.concat(completeBlog))
        handleMessage('Success creating new blog', false)
      })
      .catch((error) => {
        setIsError(true)
        handleMessage('failed to create blog', true)
      })

  }
  const removeBlog = (id) => {

    blogService
      .remove(id)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id !== id))
        handleMessage('Success deleting blog', false)
      })
      .catch((error) => {
        setIsError(true)
        handleMessage('failed to delete blog', true)
      })

  }

  const likeBlog = (id) => {
    blogService
      .like(id)
      .then((updatedBlog) => {
        setBlogs(
          blogs.map((blog) =>
            blog.id !== updatedBlog.id ? blog : updatedBlog
          ).sort((a, b) => b.likes - a.likes)
        )
      })
      .catch((error) => {
        handleMessage('Failed to like the blog', true)
      })
  }



  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          data-testid='username'
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          data-testid='password'
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )


  const handleMessage = (message, isError = false) => {
    setIsError(isError)
    setMessage(message)
    //console.log(isError)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={newMessage} isError={isError} />
        {loginForm()}
      </div>
    )
  }


  return (
    <div>
      <h2>blogs</h2>
      <Notification message={newMessage} isError={isError} />
      <p>{`logged in as ${user.username}`}</p>
      <button onClick={() => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
      }}>
        logout
      </button>
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <BlogForm
          createBlog = {addBlog}
        />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} remove={removeBlog} user={user} />
      )}
    </div>
  )
}

export default App