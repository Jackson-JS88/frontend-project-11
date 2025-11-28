import * as yup from 'yup'

const rssSchema = yup.string()
  .required('Поле не должно быть пустым')
  .url('Ссылка должна быть валидным URL')
  .test('unique-url', 'RSS уже существует', function(value) {
    const { feeds } = this.options.context;
    return !feeds.includes(value)
  })

const validateURL = (url, feeds) => {
  return rssSchema.validate(url, {
    context: { feeds },
    abortEarly: false
  })
}

export default validateURL