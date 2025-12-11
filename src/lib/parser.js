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

export default parseRSS
