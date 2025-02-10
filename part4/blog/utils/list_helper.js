const dummy = () => {
  return 1
}

const totalLikes = (blog) => {

  return blog[0].likes
}

const favoriteBlog = (blogs) => {
  
 return blogs.length ? blogs.reduce((maximum,blog) => (blog.likes > maximum.likes ? blog: maximum) ) : null
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}