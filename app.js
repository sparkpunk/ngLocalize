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
      leader = ` UI - app/${parent} `
      leader = leader.padStart(40, '-')
      leader = leader.padEnd(60, '-')

  i18n[leader] = {}
  
  var files = walk(`${src}/${parent}`)
  files.forEach(file => {

    // Get all of the ng-binds targeted for localization
    var data = fs.readFileSync(file, 'utf8')
    var ngBinds = data.match(ngRegEx) || []
  
    ngBinds.forEach(ngBind => {
      ngBind = ngBind.replace('ng-bind="::i18n.', '')
      ngBind = ngBind.replace('"', '')
      
      // Create an entry for this binding at the parent key
      i18n[leader][ngBind] = {}

      // Decamelize and Title Case the binding
      var english = decamelize(ngBind, ' ')
          english = toTitleCase(english)
      
      // If you want more language keys, add them below
      i18n[leader][ngBind]['en-us'] = english
    })
  })


})

fs.writeFile('./dist/i18n.json', JSON.stringify(i18n, null, 2))




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