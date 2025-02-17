const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
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
  //logger.info('Received token:', request.token)
  const decodedToken = jwt.verify(request.token, config.SECRET)
  //logger.info('Decoded token:', decodedToken)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  //logger.info('User found:', user)
  const blog = new Blog({
    ...request.body,
    user: user.id
  })
  try{
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
  const decodedToken = jwt.verify(request.token, config.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
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
  const blog = {
    likes: request.body.likes,
    author: request.body.author,
    url: request.body.url,
    title: request.body.title
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).json(updatedBlog)
})


module.exports = blogsRouter
