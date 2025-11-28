import './style.css'

const app = document.getElementById('app')

const formHtml = `
<div class="container mt-5">
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h1 class="text-center mb-4">RSS агрегатор</h1>
      <form id="rss-form" class="card p-4">
        <div class="mb-3">
          <label for="rss-url" class="form-label">Начните читать RSS сегодня! Это легко, это красиво.</label>
          <input 
            type="text" 
            class="form-control" 
            id="rss-url" 
            placeholder="Ссылка RRS" 
            required
          >
        </div>
        <button type="submit" class="btn btn-primary">Добавить</button>
      </form>
    </div>
  </div>
</div>
`

app.innerHTML = formHtml

const form = document.getElementById('rss-form')
form.addEventListener('submit', (event) => {
  event.preventDefault()
  const urlInput = document.getElementById('rss-url')
  const url = urlInput.value.trim()
  
  if (url) {
    console.log('Adding RSS feed:', url)

    urlInput.value = ''
  }
})
