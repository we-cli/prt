var version_list = [
  '0.12.2'
]

function get_url(version, arch){
  return [
    'http://dl.nwjs.io/v0.12.2/nwjs-v',
    version, '-win-', arch, '.zip'
  ].join('')
}

module.exports = {
  entry_list: [
    '*/nwjc.exe',
    '*/nw.exe'
  ],
  version_list: version_list,
  get_url: get_url
}
