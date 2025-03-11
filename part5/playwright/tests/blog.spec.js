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
  describe('When logged in and more than 1 blog exists', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'esko', 'salainen');
      await createBlog(page, 'testerTitle1', 'testerAuthor', 'testerUrl')
      await createBlog(page, 'testerTitle2', 'testerAuthor2', 'testerUrl2')
      await createBlog(page, 'testerTitle3', 'testerAuthor3', 'testerUrl3')
    })
    test('blogs are ordered by like', async ({ page }) => {
      const blog1 = page.locator('.blog').filter({ hasText: 'testerTitle1' })
      const blog2 = page.locator('.blog').filter({ hasText: 'testerTitle2' })
      const blog3 = page.locator('.blog').filter({ hasText: 'testerTitle3' })

      await blog1.locator('.blog-short button:has-text("view")').first().click()
      await blog2.locator('.blog-short button:has-text("view")').first().click()
      await blog3.locator('.blog-short button:has-text("view")').first().click()

      const like1 = blog1.locator('.blog-details button:has-text("like")')
      const like2 = blog2.locator('.blog-details button:has-text("like")')
      const like3 = blog3.locator('.blog-details button:has-text("like")')

      await like3.first().click()
      await like3.first().click()
      await like3.first().click()
      await like2.first().click()
      await like2.first().click()
      await like1.first().click()

      await page.waitForTimeout(3000)

      const blogTitles = await page.locator('.blog-title').allTextContents()
      expect(blogTitles).toEqual(['testerTitle3', 'testerTitle2', 'testerTitle1'])

      const getLikeCount = async (blog) => {
        const likeText = await blog.locator('.blog-likes').textContent()
        return parseInt(likeText.match(/\d+/)[0], 10)
      }

      const likes1 = await getLikeCount(blog1)
      const likes2 = await getLikeCount(blog2)
      const likes3 = await getLikeCount(blog3)
  
      expect(likes1).toBe(1)
      expect(likes2).toBe(2)
      expect(likes3).toBe(3)
    

    })
  })

})
  
