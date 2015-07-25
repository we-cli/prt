# prt

> Package Manager for Windows

```plain
$ npm install -g prt
```

## Install Packages via `prt`

Just like other Package Managers

```plain
$ brew install node   # MacOS
$ apt-get install node   # Linux
$ npm install gulp   # npm
```

```plain
$ prt install sublime_text
```

And then

```plain
$ sublime_text   # would open it up
```

Or if you want to spawn the app, you can

```plain
$ prts subime_text   # would not block
```

## Mechanism

Get-Link -> Download -> Extract -> Add-to-Path

## Todo & Cons

- Async processing
- Streaming download
- ProgressBar for download
- More packages to include
- More testing
- The implementation is very hack now

## Current Packages Included

- `nw` (nw.js, node-webkit)
- `electron`
- `mongodb`
- `sublime_text`

**We need your forks!**

## Why I Built this?

Sometimes I need to help friends to install apps, in Windows. And what we have to do is always: visit a website, click a link, download sth, and then extract it or run a setup... Holy shit!

What if just a line of terminal command via homebrew, apt-get, etc?!

So I determined to bring such a package manager for Windows. But as you see, we have very few apps now, and we support only zips which are portable. It's the very beginning.
