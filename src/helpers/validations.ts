const isEmpty = (value: any) => {
  if (value === null || value === undefined || value === '') {
    return true
  }

  if (Array.isArray(value) && value.length === 0) {
    return true
  }

  return false
}
const required = (value: string) => {
  if (Array.isArray(value) && value.length === 0) {
    return 'Data ini wajib diisi.'
  }

  if (isEmpty(value)) return 'Data ini wajib diisi.'

  return true
}

const validEmail = (value: string) => {
  if (isEmpty(value)) {
    return true
  }

  // eslint-disable-next-line
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (Array.isArray(value)) {
    return value.every(val => re.test(String(val)))
  }

  return re.test(String(value)) || 'Email tidak valid'
}

export {
  required,
  validEmail,
  isEmpty,
}