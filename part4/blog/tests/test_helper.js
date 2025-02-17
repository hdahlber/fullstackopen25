const Blog = require('../models/blog')
const User = require('../models/user')

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

const oneUser ={
  'username': 'root',
  'name': 'Superuser',
  'password': 'salainen'
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  listOfBlogs,blogsInDb,usersInDb, oneBlog, oneBlogNoTitle, oneBlogNoUrl, oneBlogOnlyAuthor, oneUser

}