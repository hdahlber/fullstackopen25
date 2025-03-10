const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith,createBlog } = require('./helper')
describe('Blog app', () => {
  beforeEach(async ({ page,request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Esko Eskola',
        username: 'esko',
        password: 'salainen',
      },
    })
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Namn Namnsson',
        username: 'namn',
        password: 'salainen',
      },
    })
    await page.goto('http://localhost:5173')
  })

    
  

  test('Login form is shown', async ({ page }) => {
    const loginForm = await page.locator('form')
    await expect(loginForm).toBeVisible()
    const usernameInput = loginForm.locator('input[name="Username"]')
    await expect(usernameInput).toBeVisible()


  })
  
  test('login succeeds with correct credentials', async ({ page }) => {
    await loginWith(page,'esko','salainen')
    await expect(page.getByText('logged in as esko')).toBeVisible()
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await loginWith(page,'wrong','wrong')
    await expect(page.getByText('logged in as wronguser')).not.toBeVisible()
    await expect(page.getByText('Wrong credentials')).toBeVisible({timeout: 5000})

    
  })
  
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page,'esko','salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page,'testerTitle','testerAuthor','testerUrl')
      await expect(page.locator('.blog-title').filter({ hasText: 'testerTitle' }).first()).toBeVisible()
  })
})
  describe('When logged in and owns a blog', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page,'esko','salainen')
      await createBlog(page,'testerTitle','testerAuthor','testerUrl')
      await expect(page.locator('.blog-title').filter({ hasText: 'testerTitle' }).first()).toBeVisible()
    })
    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      const likesElement = await page.locator('.blog-likes')
      const likesText = await likesElement.textContent()
      const likesCountStart = parseInt(likesText.match(/\d+/)[0])
      await page.getByRole('button', { name: 'like' }).click()
      await expect(likesElement).toContainText(`likes ${likesCountStart + 1}`)
    
    })  

    test('a blog can be removed', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      page.once('dialog', async dialog => {
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.locator('.blog-title').filter({ hasText: 'testerTitle' })).not.toBeVisible()
      await expect(page.getByText('Success deleting blog')).toBeVisible({timeout: 5000})
      

    })  
  
  })
  describe('When logged in not owner of any blog', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page,'esko','salainen')
      await createBlog(page,'testerTitle','testerAuthor','testerUrl')
      await page.getByRole('button', { name: 'logout'}).click()
      await loginWith(page,'namn','salainen')

    })
    test('an blogs delete button can not bee seen', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    
    })


  })

})