var version_list = [
  '0.30.0'
]

function get_url(version, arch){
  return [
    'https://github.com/atom/electron/releases/download/v0.30.0/electron-v',
    version, '-win32-', arch, '.zip'
  ].join('')
}

module.exports = {
  entry_list: [
    'electron.exe'
  ],
  version_list: version_list,
  get_url: get_url
}
