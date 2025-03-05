const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
//const logger = require('../utils/logger')


blogsRouter.get('/', async (request, response) => {
  const blogs= await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response,next) => {
  if (!request.token) return response.status(400).json({ error: 'No token found' })
  if (!request.body.title) return response.status(400).json({ error: 'Title not found' })
  if (!request.body.url) return response.status(400).json({ error: 'URL not found' })
  try {
    const user = request.user
    const blog = new Blog({
      ...request.body,
      user: user.id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
  catch(exception){
    next(exception)
  }

})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if ( blog.user.toString() === user.id.toString() ){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  else {
    response.status(401).json({ error: 'missing premission to do this' })
  }
})


blogsRouter.put('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if ( blog.user.toString() === user.id.toString() ){
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,request.body, { new: true }).populate('user', { name: 1, username: 1 })
    response.status(200).json(updatedBlog)
  }
  else {
    response.status(401).json({ error: 'missing premission to do this' })
  }
})
blogsRouter.put('/:id/like', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  blog.likes += 1
  const updatedBlog = await blog.save()
  await updatedBlog.populate('user', { name: 1, username: 1 })
  response.status(200).json(updatedBlog)
})


module.exports = blogsRouter
