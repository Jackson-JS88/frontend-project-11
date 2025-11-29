import onChange from 'on-change'
import i18next from '../i18n.js'

const initialState = {
  form: {
    state: 'filling',
    error: null,
  },
  feeds: [],
}

const createView = (state) => {
  const elements = {
    form: document.getElementById('rss-form'),
    input: document.getElementById('rss-url'),
    feedback: document.getElementById('feedback'),
    submit: document.querySelector('button[type="submit"]'),
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

  const watchedState = onChange(state, (path) => {
    if (path === 'form.state' || path === 'form.error') {
      renderForm(watchedState.form)
    }
  })

  return { watchedState, elements }
}

export { createView, initialState }