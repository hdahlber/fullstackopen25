const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

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


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(listOfBlogs[0])
  await blogObject.save()
  blogObject = new Blog(listOfBlogs[1])
  await blogObject.save()
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

test('every blog contain id', async () => {
  const response = await api.get('/api/blogs')
  const ids = response.body.map(blog => Blog.prototype.hasOwnProperty.call(blog, 'id'))
  assert.strictEqual(ids.every(id => id === true), true)
})

test('HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => {
  await api
    .post('/api/blogs')
    .send(oneBlog)
    .expect(201)
})

test('if the likes property is missing from the request, it will default to the value 0', async () => {
  await api
    .post('/api/blogs')
    .send(oneBlog)
    .expect(201)
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body[2].likes,0)
})
test('if url missing returns 400', async () => {
  await api
    .post('/api/blogs')
    .send(oneBlogNoUrl)
    .expect(400)
})
test('if title missing returns 400', async () => {
  await api
    .post('/api/blogs')
    .send(oneBlogNoTitle)
    .expect(400)
})
test('if title and url missing returns 400', async () => {
  await api
    .post('/api/blogs')
    .send(oneBlogOnlyAuthor)
    .expect(400)

})
test('Deleting person successfully return 204', async () => {
  const response = await api.get('/api/blogs')
  const blogId = response.body[0].id
  await api
    .delete(`/api/blogs/${blogId}`)
    .expect(204)
})




after(async () => {
  await mongoose.connection.close()
})
