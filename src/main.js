import './style.css'
import validateURL from './lib/validator.js'
import { createView, initialState } from './lib/view.js'

const { watchedState, elements } = createView(initialState)

const resetForm = () => {
  elements.input.value = ''
  elements.input.focus()
  watchedState.form.state = 'filling'
  watchedState.form.error = null
}

elements.form.addEventListener('submit', async (event) => {
  event.preventDefault()
  
  const formData = new FormData(event.target)
  const url = formData.get('url').trim()
  
  watchedState.form.state = 'validating'
  
  try {
    await validateURL(url, watchedState.feeds)
    
    watchedState.form.state = 'valid'
    watchedState.feeds.push(url)
    
    resetForm()
    
  } catch (error) {
    watchedState.form.state = 'invalid'
    watchedState.form.error = error.name === 'ValidationError' 
      ? error.errors[0] 
      : 'Произошла ошибка при валидации'
  }
})