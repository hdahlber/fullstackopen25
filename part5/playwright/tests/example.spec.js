const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
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
      await page.getByTestId('username').fill('hello')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('logged in as hello')).toBeVisible()
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
})