const dummy = () => {
  return 1
}

const totalLikes = (blog) => {

  return blog[0].likes
}

const favoriteBlog = (blogs) => {

  return blogs.length ? blogs.reduce((maximum,blog) => (blog.likes > maximum.likes ? blog: maximum) ) : null
}


const mostBlogs = (blogs) => {
  if(blogs.length === 0){
    return null
  }

  const _ = require('lodash')
  const authorCounts = _.countBy(blogs, 'author')
  const winner = _.maxBy(_.map(authorCounts ,(blogs ,author) => ({ author,blogs })),'blogs')
  return winner
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs
}