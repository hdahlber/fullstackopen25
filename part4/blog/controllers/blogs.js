const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs= await Blog
  .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response,next) => {
  const user = await User.findOne()
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
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
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
