var assert = require('assert');
var path = require('path');

var AndroidManifest = require('..');

var android = new AndroidManifest();
android.load({ file: path.join(__dirname, "AndroidManifest.xml") }, function(err){
    android.version = "2.5.6.7";
    android.bundleIdentifier = "com.test.sample";
    android.displayName = "Sample";
    android.save({ file: path.join(__dirname, "AndroidManifest.Updated.xml") }, function(err) {
        console.log("DONE");
    })
})