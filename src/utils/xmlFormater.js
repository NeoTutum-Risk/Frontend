export const xmlFormatter = data => {
  let formBody = []
  for (let property in data) {
    var encodedKey = encodeURIComponent(property)
    var encodedValue = encodeURIComponent(data[property])
    formBody.push(encodedKey + '=' + encodedValue)
  }
  formBody = formBody.join('&')
  return formBody
}
