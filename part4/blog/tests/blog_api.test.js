const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const listOfBlogs = [
    { title: 'Clean Code', author: 'Robert C. Martin', likes: 15 },
    { title: 'The Pragmatic Programmer', author: 'Andy Hunt', likes: 10 },
    { title: 'Refactoring', author: 'Martin Fowler', likes: 12 },
    { title: 'The Mythical Man-Month', author: 'Fred Brooks', likes: 8 },
    { title: 'You Don\'t Know JS', author: 'Kyle Simpson', likes: 14 },
    { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', likes: 11 },
    { title: 'Clean Architecture', author: 'Robert C. Martin', likes: 1 },
    { title: 'Agile Software Development', author: 'Robert C. Martin', likes: 1 }
  ]
const oneBlog = {
    title: 'Clean Architecture', 
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
    const ids = response.body.map(blog => blog.hasOwnProperty('id'))
    assert.strictEqual(ids.every(id => id === true), true)
})

test('HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => {
    await api
        .post('/api/blogs')
        .send(oneBlog)
        .expect(201)
})

test.only('if the likes property is missing from the request, it will default to the value 0', async () => {
    await api
        .post('/api/blogs')
        .send(oneBlog)
        .expect(201)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body[2].likes,0)
})

    

  
  after(async () => {
    await mongoose.connection.close()
  })
