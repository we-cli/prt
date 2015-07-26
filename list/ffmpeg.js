var version_list = [
  '20150721-git-6b96c70'
]

// http://ffmpeg.org/download.html#build-windows
// http://ffmpeg.zeranoe.com/builds/win64/static/ffmpeg-20150721-git-6b96c70-win64-static.7z
function get_url(version, arch){
  if (arch === 'ia32') arch = '32'
  else if (arch === 'x64') arch = '64'
  return [
    'http://ffmpeg.zeranoe.com/builds/win', arch,
    '/static/ffmpeg-', version, '-win', arch, '-static.7z'
  ].join('')
}

module.exports = {
  entry_list: [
    '*/bin/*.exe'
  ],
  version_list: version_list,
  get_url: get_url
}
