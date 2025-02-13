const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs= await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response,next) => {
  const blog = new Blog(request.body)
  try{
    const savedBlog = await blog.save()
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


blogsRouter.put("/:id", async (request, response) => {
  const blog = {
      likes: request.body.likes,
      author: request.body.author,
      url: request.body.url,
      title: request.body.title
  }
  await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).end()
})


module.exports = blogsRouter
