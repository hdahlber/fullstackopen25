const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 } )
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username,name,password } = request.body

  if(!password){
    return response.status(400).json({
      error: 'password is required'
    })
  }
  if(password.length < 3) {
    return response.status(400).json({
      error: 'password has to be more than 3 char long',
    })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  //console.log("Generated passwordHash:", passwordHash)


  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  //console.log("Saved user in MongoDB:", savedUser)


  response.status(201).json(savedUser)
})

module.exports = usersRouter