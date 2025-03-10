const loginWith = async (page, username, password)  => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }

  const createBlog = async (page, title,author,url) => {
    await page.getByRole('button', { name: 'new note' }).click()
    await page.getByPlaceholder('Title').fill(title)
    await page.getByPlaceholder('Author').fill(author)
    await page.getByPlaceholder('Url').fill(url)
    await page.getByRole('button', { name: 'create a new blog' }).click()
  }
  
  export { loginWith, createBlog }