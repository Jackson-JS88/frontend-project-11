import axios from 'axios'

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

      return response.data.contents
    })
    .catch((error) => {
      if (error.message === 'parseError') {
        return Promise.reject(error)
      }
      return Promise.reject(new Error('networkError'))
    })
}

const fetchRSSForUpdate = (url) => {
  return fetchRSS(url)
}

export { fetchRSS, fetchRSSForUpdate }
