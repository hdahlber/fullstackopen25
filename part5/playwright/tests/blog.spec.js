const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Esko Eskola',
        username: 'esko',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = await page.locator('form')
    await expect(loginForm).toBeVisible()
    const usernameInput = loginForm.locator('input[name="Username"]')
    await expect(usernameInput).toBeVisible()


  })
  describe('log in',() =>{
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByTestId('username').fill('esko')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('logged in as esko')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByTestId('username').fill('wronguser')
      await page.getByTestId('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('logged in as wronguser')).not.toBeVisible()
      await expect(page.getByText('Wrong credentials')).toBeVisible({timeout: 5000})

      
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByTestId('username').fill('esko')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      await page.getByPlaceholder('Title').fill('testerTitle')
      await page.getByPlaceholder('Author').fill('testerAuthor')
      await page.getByPlaceholder('Url').fill('testerUrl')
      await page.getByRole('button', { name: 'create a new blog' }).click()
      await expect(page.locator('.blog-title').filter({ hasText: 'testerTitle' }).first()).toBeVisible()


     
    })
  })
})