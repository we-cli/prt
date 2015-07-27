#!/usr/bin/env node
var url_parse = require('url').parse
var resolve = require('path').resolve
var extname = require('path').extname
var basename = require('path').basename
var dirname = require('path').dirname
var existsSync = require('fs').existsSync
//var unlinkSync = require('fs').unlinkSync
var writeFileSync = require('fs').writeFileSync
var createWriteStream = require('fs').createWriteStream
var os_arch = require('os').arch
var shell = require('shelljs')
var glob = require('glob')
var _7z = require('7zip')['7z']
var Download = require('download')
//var dwn = require('dwn')
//var bar = require('progress-bar').create(process.stdout)
//var mkdirpSync = require('mkdirp').sync

var action = process.argv[2]
switch (action) {
  case 'install':
    var name = process.argv[3]
    var version = process.argv[4]
    do_install(name, version, function(err){
      if (err) {
        console.error(err)
        process.exit(1)
      }
    });
    break; // dont forget `break`
  default:
    console.error('action not found')
    process.exit(1)
}

function do_install(name, version, callback){
  var listdir = resolve(__dirname, '../list/')
  var modname = resolve(listdir, name)
  if (modname.indexOf(listdir) !== 0) { // bad guy detected
    callback(new Error('invalid pak'))
    return
  }
  try {
    var mod = require(modname)
  } catch(err) {
    console.error('pak not found')
    callback(err)
    return
  }
  if (!version) version = mod.version_list[0] // defaults latest
  mod.name = name // append `name`
  mod.version = version // append `version`
  download(mod, function(err){
    if (err) {
      unpack_done(err)
      return
    }
    if (mod.ext === '.exe' || mod.ext === '.msi') {
      if (mod.entry_list) { // single exe
        unpack(mod, unpack_done)
      } else { // installer
        shell.exec('prts "' + mod.file + '"', { silent: true })
        console.log('installer spawn complete')
      }
      return
    } else {
      unpack(mod, unpack_done)
    }
  })
  function unpack_done(err){
    if (err) {
      callback(err)
      return
    }
    try {
       link(mod)
    } catch(err) {
      console.error('link fail')
      callback(err)
      return
    }
    console.log('link complete')
    callback(null)
  }
}

function link(mod){
  var entryfiles = mod.entry_list.reduce(function(arr, pattern){
    var files = glob.sync(pattern, { cwd: mod.dest })
    arr.push.apply(arr, files)
    return arr
  }, [])

  entryfiles.forEach(function(file){
    var ext = extname(file)
    var base = basename(file, ext)
    var cmdfile = resolve(process.env.windir, base + '.cmd')
    var cmd = '"' + resolve(mod.dest, file) + '" %*'
    writeFileSync(cmdfile, cmd)
    console.log('link created', cmdfile) // exec (blocked)
    // would be too noisy ;)
    //var cmdfile_ = resolve(process.env.windir, name + '_.cmd')
    //var cmd_ = 'prts "' + cmdfile + '" %*'
    //writeFileSync(cmdfile_, cmd_)
    //console.log('link created', cmdfile_) // spawn (detached)
  })
}

function unpack(mod, callback){
  // fixme: 7z -o not work
  // fixme: cwd chdir hack
  var _cwd = process.cwd()
  process.chdir(mod.dest)
  //if (!shell.which('7z')) {
  //  callback(new Error('install 7z first'))
  //  return
  //}
  // 7z -y
  // http://superuser.com/questions/483037/extract-and-overwrite-existing-files
  shell.exec('"' + _7z + '" x -y "' + mod.file + '"', { silent: true })
  process.chdir(_cwd)
  //unlinkSync(mod.file)
  callback(null)
}

function download(mod, callback){
  var uri = mod.get_url(mod.version, os_arch())
  var dest = resolve(__dirname, '../cache', mod.name, mod.version)
  var fname = basename(url_parse(uri).pathname)
  var file = resolve(dest, fname)
  var ext = extname(file)
  mod.uri = uri // append `uri`
  mod.dest = dest // append `dest`
  mod.file = file // append `file`
  mod.ext = ext // append `file`
  if (existsSync(file) ) {
    console.log('already exist', file)
    callback(null)
    return
  }
  console.log('downloading from', uri)
  console.log('saving to', file)

  new Download({ extract: false })
    .get(uri)
    .dest(dest)
    .run(function(err){
      if (err) {
        console.error('download fail')
        callback(err)
        return
      }
      console.log('download complete')
      callback(null)
    })
}
