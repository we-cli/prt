var version_list = [
  '3.0.4'
]

function get_url(version, arch){
  if (arch === 'ia32') arch = 'i386'
  else if (arch === 'x64') arch = 'x86_64'
  return [
    'https://fastdl.mongodb.org/win32/mongodb-win32-',
    arch, '-', version, '.zip'
  ].join('')
}

module.exports = {
  entry_list: [
    '*/bin/*.exe'
  ],
  version_list: version_list,
  get_url: get_url
}
