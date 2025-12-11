const parseRSS = (xmlString) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml')

  const parseError = xmlDoc.querySelector('parsererror')
  if (parseError) {
    throw new Error('parseError')
  }

  const feedTitle = xmlDoc.querySelector('channel > title')?.textContent || 'Без названия'
  const feedDescription = xmlDoc.querySelector('channel > description')?.textContent || 'Без описания'

  const items = xmlDoc.querySelectorAll('item')
  const posts = Array.from(items).map(item => ({
    title: item.querySelector('title')?.textContent || 'Без названия',
    link: item.querySelector('link')?.textContent || '#',
    description: item.querySelector('description')?.textContent || 'Без описания',
  }))

  return { feedTitle, feedDescription, posts }
}

export default parseRSS
