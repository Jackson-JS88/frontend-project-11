import axios from 'axios'

const fetchRSS = (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`

  return axios.get(proxyUrl, { timeout: 10000 })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('networkError')
      }

      if (!response.data.contents) {
        throw new Error('parseError')
      }

      return response.data.contents
    })
    .catch((error) => {
      if (error.message === 'parseError') {
        throw error
      }
      throw new Error('networkError')
    })
}

const fetchRSSForUpdate = (url) => {
  return fetchRSS(url)
}

export { fetchRSS, fetchRSSForUpdate }
