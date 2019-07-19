const fs = require('fs')
const path = require('path')

const src = `./src`
const ext = 'html'

const parents = fs.readdirSync(src, 'utf8')
const ngRegEx = new RegExp(/ng-bind="::i18n.[A-Za-z]+"/g)

var files = walk(src)


files.forEach(file => {
  var data = fs.readFileSync(file, 'utf8')
  var ngBinds = data.match(ngRegEx) || []
  
  ngBinds.forEach(ngBind => {
    ngBind = ngBind.replace('ng-bind="::i18n.', '')
    ngBind = ngBind.replace('"', '')
    console.log(ngBind)
  })

})








// UTILITIES ========================================
// ==================================================
function walk(dir) {
  var results = []
  var list = fs.readdirSync(dir)
  list.forEach(function(file) {
    file = dir + '/' + file
    var stat = fs.statSync(file)
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file))
    } else {
      let isExt = file.split('.').pop() == ext ? true : false
      if(isExt) results.push(file)
    }
  })
  return results
}