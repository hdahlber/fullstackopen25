import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
test('renders content', async () =>  {
  const createBlog = vi.fn()
  const user = userEvent.setup()
  render(<BlogForm createBlog={createBlog}/>)

  const inputTitle = screen.getByPlaceholderText('Title')
  const inputAuthor = screen.getByPlaceholderText('Author')
  const inputUrl = screen.getByPlaceholderText('Url')
  const sendButton = screen.getByText('create a new blog')

  await user.type(inputTitle, 'testerTitle')
  await user.type(inputAuthor, 'testerAuthor')
  await user.type(inputUrl, 'testerUrl')
  await user.click(sendButton)
  console.log(createBlog.mock.calls)
  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'testerTitle',
    author: 'testerAuthor',
    url: 'testerUrl',
  })


})
