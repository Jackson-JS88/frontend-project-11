import './style.css'
import './i18n.js'
import validateURL from './lib/validator.js'
import { fetchRSS, fetchRSSForUpdate } from './lib/parser.js'
import { createView, initialState } from './lib/view.js'
import * as bootstrap from 'bootstrap'

const { watchedState, elements } = createView(initialState)

const resetForm = () => {
  elements.input.value = ''
  elements.input.focus()
}

const addFeedWithPosts = (url, feedData) => {
  const feedId = `feed_${Date.now()}`
  const newFeed = {
    id: feedId,
    title: feedData.feedTitle,
    description: feedData.feedDescription,
    url,
  }

  const newPosts = feedData.posts.map((post, index) => ({
    id: `${feedId}_post_${index}`,
    feedId: newFeed.id,
    title: post.title,
    link: post.link,
    description: post.description,
  }))

  watchedState.feeds.push(newFeed)
  watchedState.posts.push(...newPosts)
}

const openPostModal = (post) => {
  const modal = document.getElementById('postModal')
  const modalTitle = modal.querySelector('.modal-title')
  const modalBody = modal.querySelector('.modal-body')
  const fullArticleLink = modal.querySelector('.full-article')

  modalTitle.textContent = post.title
  modalBody.textContent = post.description || 'Нет описания'
  fullArticleLink.href = post.link

  const modalInstance = new bootstrap.Modal(modal)
  modalInstance.show()

  watchedState.readPostsIds.add(post.id)
}

const updateFeeds = () => {
  watchedState.feeds.forEach((feed) => {
    fetchRSSForUpdate(feed.url)
      .then((feedData) => {
        const existingPostLinks = watchedState.posts
          .filter(post => post.feedId === feed.id)
          .map(post => post.link)

        const newPosts = feedData.posts
          .filter(post => !existingPostLinks.includes(post.link))
          .map((post, index) => ({
            id: `${feed.id}_post_${Date.now()}_${index}`,
            feedId: feed.id,
            title: post.title,
            link: post.link,
            description: post.description,
          }))

        if (newPosts.length > 0) {
          watchedState.posts.unshift(...newPosts)
        }
      })
      .catch((error) => {
        console.error(`Ошибка обновления фида ${feed.url}:`, error.message)
      })
  })

  setTimeout(updateFeeds, 5000)
}

elements.form.addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(event.target)
  const url = formData.get('url').trim()

  watchedState.form.state = 'validating'
  watchedState.error = null
  watchedState.loading = true

  validateURL(url, watchedState.feeds.map(feed => feed.url))
    .then(() => {
      watchedState.form.state = 'valid'
      return fetchRSS(url)
    })
    .then((feedData) => {
      addFeedWithPosts(url, feedData)
      resetForm()
      watchedState.loading = false
    })
    .catch((error) => {
      watchedState.loading = false

      if (error.name === 'ValidationError') {
        watchedState.form.state = 'invalid'
        watchedState.form.error = error.errors[0]
      }
      else if (error.message === 'parseError') {
        watchedState.form.state = 'invalid'
        watchedState.error = error.message
        watchedState.form.error = 'parseError'
      }
      else if (error.message === 'networkError') {
        watchedState.form.state = 'invalid'
        watchedState.error = error.message
        watchedState.form.error = 'networkError'
      }
      else {
        watchedState.form.state = 'invalid'
        watchedState.error = error.message
        watchedState.form.error = 'unknownError'
      }
    })
})

elements.input.addEventListener('input', () => {
  if (watchedState.form.state === 'invalid' || watchedState.form.state === 'valid') {
    watchedState.form.state = 'filling'
    watchedState.form.error = null
    watchedState.error = null
  }
})

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn-outline-primary') && event.target.textContent.trim() === 'Просмотр') {
    const postId = event.target.dataset.postId
    const post = watchedState.posts.find(p => p.id === postId)

    if (post) {
      openPostModal(post)
    }
  }

  if (event.target.matches('.posts a[data-post-id]')) {
    const postId = event.target.dataset.postId
    watchedState.readPostsIds.add(postId)
  }
})

setTimeout(updateFeeds, 5000)
