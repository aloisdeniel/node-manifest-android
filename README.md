# manifest-android

Update your Android mobile application manifest (version, bundle idenfifier, ...).

## Install

```sh
$ npm install --save manifest-android
```

## Quickstart

```js
var path = require('path');
var AndroidManifest = require('manifest-android');

var android = new AndroidManifest();
android.load({ file: path.join(__dirname, "AndroidManifest.xml") }, function(err){
    android.version = "2.5.6.7";
    android.bundleIdentifier = "com.test.sample";
    android.displayName = "Sample";
    android.save({ file: path.join(__dirname, "AndroidManifest.Updated.xml") }, function(err) {
        console.log("DONE");
    })
})
```

## Other manifests

* [iOS](https://github.com/aloisdeniel/node-manifest-ios)
* [UWP](https://github.com/aloisdeniel/node-manifest-uwp)

## Copyright and license

MIT © [Aloïs Deniel](http://aloisdeniel.github.io)