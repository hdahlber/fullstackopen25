const BlogForm = ({
  handleBlog,
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange
  }) => {
  return (
  <div>
    <form onSubmit={handleBlog}>
      <h2>create new: </h2>
      <div>
        title:
      <input
          type="text"
          value={title}
          name="Title"
          onChange={handleTitleChange}
          />
      </div>
      <div>
        author:
      <input
          type="text"
          value={author}
          name="Author"
          onChange={handleAuthorChange}
          />
      </div>
      <div>
      url:
      <input
          type="text"
          value={url}
          name="Url"
          onChange={handleUrlChange}
          />
      </div>
      <button type="submit">create a new blog</button>
      </form>   
    </div>
 
  )
}

  export default BlogForm
  