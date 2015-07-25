var version_list = [
  '3083'
  //'2.0.2'
]

// http://www.sublimetext.com/2
// http://www.sublimetext.com/3
// http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%203083%20x64.zip
function get_url(version, arch){
  if (arch === 'ia32') arch = ''
  else if (arch === 'x64') arch = '%20x64'
  return [
    'http://c758482.r82.cf2.rackcdn.com/Sublime%20Text%20Build%20',
    version, arch, '.zip'
  ].join('')
}

module.exports = {
  entry_list: [
    'sublime_text.exe'
  ],
  version_list: version_list,
  get_url: get_url
}
