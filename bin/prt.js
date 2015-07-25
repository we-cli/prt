#!/usr/bin/env node
var resolve = require('path').resolve
var extname = require('path').extname
var basename = require('path').basename
var dirname = require('path').dirname
var existsSync = require('fs').existsSync
var writeFileSync = require('fs').writeFileSync
var createWriteStream = require('fs').createWriteStream
var os_arch = require('os').arch
var Download = require('download')
var glob = require('glob')
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
  var listdir = resolve('./list/')
  var modname = resolve(listdir, name)
  if (modname.indexOf(listdir) !== 0) { // bad guy detected
    callback(new Error('invalid target'))
    return
  }
  try {
    var mod = require(modname)
  } catch(err) {
    callback(new Error('target not found'))
    return
  }
  if (!version) version = mod.version_list[0] // defaults latest
  mod.name = name // append `name`
  mod.version = version // append `version`
  download(mod, function(err){
    if (err) {
      callback(err)
      return
    }

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
      //var cmd_ = 'prt-spawn "' + cmdfile + '" %*'
      //writeFileSync(cmdfile_, cmd_)
      //console.log('link created', cmdfile_) // spawn (detached)
    })
  })
}

/*function unpack(mod, callback){
  var ext = extname(mod.file)
  switch (ext) {
    case '.zip':
      var dir = mod.file.slice(0, -4) // `substr` not works
      mod.dir = dir // append `dir`
      console.log('unpacking to', dir)
      extract_zip(mod.file, dir, function(err){
        if (err) {
          console.error('unpack fail')
          callback(err)
          return
        }
        console.log('unpack complete')
        console.log(mod)
      })
      var zip = new AdmZip(mod.file)
      zip.extractAllTo(dir, true)
      console.log('unpack complete')
      break;
  }
}*/

function download(mod, callback){
  var uri = mod.get_url(mod.version, os_arch())
  var dest = resolve('./cache', mod.name, mod.version)
  var file = resolve(dest, basename(uri)
    .replace(/\?.*/, '')) // .zip
  var dir = file.replace(/\.zip$/, '') // dir
  mod.uri = uri // append `uri`
  mod.dest = dest // append `dest`
  mod.file = file // append `file`
  if (existsSync(dest) ) {
    console.log('already exist', file)
    callback(null)
    return
  }
  console.log('downloading from', uri)
  console.log('saving to', file)

  new Download({
      extract: true
    })
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

  /*var stream = _dwn(uri)
  stream.on('error', function(err){
    console.error('download fail')
    callback(err)
  })
  stream.on('end', function(){
    console.log('download complete')
    callback(null)
  })
  stream.on('progress', function(v){
    bar.update(v)
  })
  mkdirpSync(dirname(file))
  stream.pipe(createWriteStream(file))*/
}
