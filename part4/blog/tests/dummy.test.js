const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('most likes for a blog',() =>{
  const listOfBooks =[
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    },
    {
      title: "Män som hatar kvinnor",
      author: "Stig Larsson",
      likes: 11
    },
    {
      title: "Villospår",
      author: "Henning Mankell",
      likes: 10
    },
    {
      title: "Cilkan Tarina",
      author: "Heather Morris",
      likes: 9
    }
  ]
  const mostLikesBlog =
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }
  test('Returns blog with most likes if there is a blog', () => {
    const result = listHelper.favoriteBlog(listOfBooks)
    console.log(result);
    
    assert.deepStrictEqual(result, mostLikesBlog)
  })

  test('Returns null if no blogs', () => {
    const result = listHelper.favoriteBlog([])
    console.log(result);
    
    assert.deepStrictEqual(result, null)
  })
})