import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', async () =>  {
  const blog = {
    user: 'OneTestToRuleThemAll',
    likes: 3,
    author: 'Tester McTester',
    title: 'The lord of the Tester',
    url: 'lott.com'
  }

  render(<Blog blog={blog} />)
  const authorElement = screen.getByText('Tester McTester')
  expect(authorElement).toBeDefined()
  const titleElement = screen.getByText('The lord of the Tester')
  expect(titleElement).toBeDefined()
  const userElement = screen.queryByText('OneTestToRuleThemAll')
  expect(userElement).not.toBeInTheDocument()
  const likesElement = screen.queryByText(3)
  expect(likesElement).not.toBeInTheDocument()
  const urlElement = screen.queryByText('lott.com')
  expect(urlElement).not.toBeInTheDocument()
})
test('renders details when button clicked', async () =>  {
  const user = userEvent.setup()
  const blog = {
    user: {
      name: 'The Test',
      id: 'OneTestToRuleThemAll'
    },
    likes: 3,
    author: 'Tester McTester',
    title: 'The lord of the Tester',
    url: 'lott.com'
  }
  const { container } = render(<Blog blog={blog} />)
  const button = screen.getByText('view')
  await user.click(button)
  const detailsElement = container.querySelector('.blog-details')
  expect(detailsElement).toHaveTextContent('lott.com')
  expect(detailsElement).toHaveTextContent('likes 3')
  expect(detailsElement).toHaveTextContent('The Test')

})