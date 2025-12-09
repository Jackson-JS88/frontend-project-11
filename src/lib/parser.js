import axios from 'axios'

const parseRSS = (xmlString) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml')

  const parseError = xmlDoc.querySelector('parsererror')
  if (parseError) {
    const error = new Error('parseError')
    return Promise.reject(error)
  }

  const feedTitle = xmlDoc.querySelector('channel > title')?.textContent || 'Без названия'
  const feedDescription = xmlDoc.querySelector('channel > description')?.textContent || 'Без описания'

  const items = xmlDoc.querySelectorAll('item')
  const posts = Array.from(items).map(item => ({
    title: item.querySelector('title')?.textContent || 'Без названия',
    link: item.querySelector('link')?.textContent || '#',
    description: item.querySelector('description')?.textContent || 'Без описания',
  }))

  return Promise.resolve({ feedTitle, feedDescription, posts })
}

const fetchRSS = (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`

  return axios.get(proxyUrl, { timeout: 10000 })
    .then((response) => {
      if (response.status !== 200) {
        return Promise.reject(new Error('networkError'))
      }

      if (!response.data.contents) {
        return Promise.reject(new Error('parseError'))
      }

      return parseRSS(response.data.contents)
    })
    .catch(() => {
      return Promise.reject(new Error('networkError'))
    })
}

const fetchRSSForUpdate = (url) => {
  return fetchRSS(url)
}

export { fetchRSS, fetchRSSForUpdate }
