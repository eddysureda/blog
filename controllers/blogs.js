const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')


//GET ALL
blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

//GET resource by ID
blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })

    .catch(error => next(error))
})

//DELETE a resource

blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//POST Add a resource

blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  if (body.title === undefined) {
    return response.status(400).json({ error: 'title missing' })
  }
  if (body.author === undefined) {
    return response.status(400).json({ error: 'author missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog.save()
    .then(savedBlog => {
      response.json(savedBlog)
    })
    .catch(error => next(error))
})

// END POST Add a resource

// Update a resource
blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
  })

module.exports = blogsRouter