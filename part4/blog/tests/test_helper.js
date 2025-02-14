const Blog = require('../models/blog')

const listOfBlogs = [
  { title: 'Clean Code', author: 'Robert C. Martin', url: 'www.ds.com', likes: 15 },
  { title: 'The Pragmatic Programmer', author: 'Andy Hunt', url:'this is url', likes: 10 },
]
const oneBlog = {
  title: 'Clean Architecture',
  author: 'Robert C. Martin',
  url:'this is url'
}

const oneBlogNoUrl = {
  title: 'Clean Architecture',
  author: 'Robert C. Martin',
}
const oneBlogNoTitle = {
  author: 'Robert C. Martin',
  url:'this is url'
}
const oneBlogOnlyAuthor = {
  author: 'Robert C. Martin',
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  listOfBlogs,blogsInDb, oneBlog, oneBlogNoTitle, oneBlogNoUrl, oneBlogOnlyAuthor

}