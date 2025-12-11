import onChange from 'on-change'
import i18next from '../i18n.js'

const initialState = {
  form: {
    state: 'filling',
    error: null,
  },
  feeds: [],
  posts: [],
  readPostsIds: new Set(),
  loading: false,
  error: null,
}

const createView = (state) => {
  const elements = {
    form: document.getElementById('rss-form'),
    input: document.getElementById('rss-url'),
    feedback: document.getElementById('feedback'),
    submit: document.querySelector('button[type="submit"]'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  }

  const renderForm = (formState) => {
    const { input, feedback, submit } = elements

    input.classList.remove('is-invalid', 'is-valid')
    feedback.textContent = ''
    feedback.className = 'feedback m-0 position-absolute small'
    submit.disabled = false

    switch (formState.state) {
      case 'validating':
        submit.disabled = true
        feedback.className = 'feedback m-0 position-absolute small text-info'
        feedback.textContent = i18next.t('validating')
        break

      case 'invalid':
        input.classList.add('is-invalid')
        feedback.className = 'feedback m-0 position-absolute small text-danger'
        feedback.textContent = formState.error ? i18next.t(formState.error) : i18next.t('unknownError')
        break

      case 'valid':
        input.classList.add('is-valid')
        feedback.className = 'feedback m-0 position-absolute small text-success'
        feedback.textContent = i18next.t('success')
        break

      default:
        break
    }
  }

  const renderFeeds = (feeds) => {
    const { feedsContainer } = elements

    if (feeds.length === 0) {
      feedsContainer.innerHTML = ''
      return
    }

    const feedsHTML = feeds.map(feed => `
      <div class="mb-4">
        <h3 class="h5"><b>${feed.title}</b></h3>
        <p class="mb-2">${feed.description}</p>
      </div>
    `).join('')

    feedsContainer.innerHTML = `
      <div class="row">
        <div class="col">
          <div class="card border-0">
            <div class="card-body p-0">
              <h2 class="h4 mb-3"><b>Фиды</b></h2>
              ${feedsHTML}
            </div>
          </div>
        </div>
      </div>
    `
  }

  const renderPosts = (posts, readPostsIds) => {
    const { postsContainer } = elements

    if (posts.length === 0) {
      postsContainer.innerHTML = ''
      return
    }

    const postsHTML = posts.map((post) => {
      const isRead = readPostsIds.has(post.id)
      const fontWeightClass = isRead ? 'fw-normal' : 'fw-bold'
      const linkColorClass = isRead ? 'link-secondary' : 'link-primary'

      return `
        <div class="mb-3 border-bottom pb-3 d-flex justify-content-between align-items-start">
          <a href="${post.link}" class="text-decoration-none ${linkColorClass} ${fontWeightClass}" 
             target="_blank" rel="noopener noreferrer" data-post-id="${post.id}">
            ${post.title}
          </a>
          <button type="button" class="btn btn-outline-primary btn-sm" data-post-id="${post.id}">
            Просмотр
          </button>
        </div>
      `
    }).join('')

    postsContainer.innerHTML = `
      <div class="row">
        <div class="col">
          <div class="card border-0">
            <div class="card-body p-0">
              <h2 class="h4 mb-3"><b>Посты</b></h2>
              ${postsHTML}
            </div>
          </div>
        </div>
      </div>
    `
  }

  const renderError = (error) => {
    const { feedback } = elements
    if (error) {
      feedback.className = 'feedback m-0 position-absolute small text-danger'
      feedback.textContent = i18next.t(error)
    }
  }

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.state' || path === 'form.error') {
      renderForm(watchedState.form)
    }

    if (path === 'feeds') {
      renderFeeds(value)
    }

    if (path === 'posts' || path === 'readPostsIds') {
      renderPosts(watchedState.posts, watchedState.readPostsIds)
    }

    if (path === 'error') {
      renderError(value)
    }

    if (path === 'loading') {
      elements.submit.disabled = value
    }
  })

  return { watchedState, elements }
}

export { createView, initialState }
