import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
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