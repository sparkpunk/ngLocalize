const fs = require('fs')
const path = require('path')
const decamelize = require('decamelize')

const src = `./src`
const ext = 'html'

const parents = fs.readdirSync(src, 'utf8')
const ngRegEx = new RegExp(/ng-bind="::i18n.[A-Za-z]+"/g)

var unique_bindings = []
var bindings = []

var i18n = {}

parents.forEach((parent) => {
  var leader = `${decamelize(parent, ' ')}`
  var files = walk(`${src}/${parent}`)

  i18n[leader] = {}
  
  files.forEach(file => {
    var data = fs.readFileSync(file, 'utf8')
    var ngBinds = data.match(ngRegEx) || []
  
    ngBinds.forEach(ngBind => {
      ngBind = ngBind.replace('ng-bind="::i18n.', '')
      ngBind = ngBind.replace('"', '')

      var english = decamelize(ngBind, ' ')
          english = toTitleCase(english)
      
      i18n[leader][ngBind] = {}
      i18n[leader][ngBind]['en-us'] = english
    })
  })


})

console.log(i18n)




// UTILITIES ========================================
// ==================================================
function count(arr) {
  let obj = {}
  arr.map(item => {
    obj[item] = obj[item] ? obj[item] + 1 : 1
  })
  return obj
}
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

function toTitleCase(str) {
  return str.replace(
      /\w\S*/g,
      function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
  );
}