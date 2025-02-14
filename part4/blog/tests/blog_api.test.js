const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)

describe('when there are some notes saved initially', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.listOfBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.listOfBlogs.length)
  })

  test('every blog contains an id', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(blog => Blog.prototype.hasOwnProperty.call(blog, 'id'))
    assert.strictEqual(ids.every(id => id === true), true)
  })

  describe('adding a blog', () => {

    test('succeeds with status code 201 if valid blog', async () => {
      await api
        .post('/api/blogs')
        .send(helper.oneBlog)
        .expect(201)

      const blogsAtEnd= await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length,helper.listOfBlogs.length+1)
    })

    test('defaults to value 0 for likes, if likes are missing', async () => {
      await api
        .post('/api/blogs')
        .send(helper.oneBlog)
        .expect(201)
      const blogsAtEnd= await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd[blogsAtEnd.length-1].likes,0)
    })

    test('fails with status code 400 if url is missing', async () => {
      await api
        .post('/api/blogs')
        .send(helper.oneBlogNoUrl)
        .expect(400)
      const blogsAtEnd= await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length,helper.listOfBlogs.length)
    })

    test('fails with status code 400 if title is missing', async () => {
      await api
        .post('/api/blogs')
        .send(helper.oneBlogNoTitle)
        .expect(400)
      const blogsAtEnd= await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length,helper.listOfBlogs.length)
    })

    test('fails with status code 400 if title and url is missing', async () => {
      await api
        .post('/api/blogs')
        .send(helper.oneBlogOnlyAuthor)
        .expect(400)
      const blogsAtEnd= await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length,helper.listOfBlogs.length)
    })
  })

  describe('deleting a blog', () => {

    test('succeeds with status code 204 if id is valid', async () => {
      const response = await api.get('/api/blogs')
      const blogId = response.body[0].id
      await api
        .delete(`/api/blogs/${blogId}`)
        .expect(204)
      const blogsAtEnd= await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length,helper.listOfBlogs.length-1)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const blogId= 'invalidID'
      await api
        .delete(`/api/blogs/${blogId}`)
        .expect(400)
      const blogsAtEnd= await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length,helper.listOfBlogs.length)
    })
  })

  describe('update a blog with likes', () => {
    test('succeeds with status code 200 if likes is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: 555 })
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

      assert.strictEqual(updatedBlog.likes, 555)

    })
    test('fails with status code 400 if likes is invalid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: 'sdfsdffsdsdf' })
        .expect(400)

      const blogsAtEnd= await helper.blogsInDb()
      assert.deepStrictEqual(blogsAtEnd,blogsAtStart)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
