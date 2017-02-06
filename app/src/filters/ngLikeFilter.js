module.exports = function ngLikeFilter (arr, property, equalTo) {
  if (!property || !equalTo) {
    return arr
  }
  var newArr = []
  for (var i=0; i < arr.length; i++) {
    if (arr[i][property] && arr[i][property] === equalTo) {
      newArr.push(arr[i])
    }
  }
  return newArr
}
