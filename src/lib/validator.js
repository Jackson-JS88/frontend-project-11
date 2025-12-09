import * as yup from 'yup'

yup.setLocale({
  string: {
    url: 'errors.url',
  },
  mixed: {
    required: 'errors.required',
    notOneOf: 'errors.notOneOf',
  },
})

const createRssSchema = feeds => yup.string()
  .required()
  .url()
  .notOneOf(feeds)

const validateURL = (url, feeds) => {
  const schema = createRssSchema(feeds)
  return schema.validate(url, { abortEarly: false })
}

export default validateURL
