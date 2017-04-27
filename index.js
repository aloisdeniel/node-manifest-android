var fs = require('fs');
var XML = require('xmlobject');
var parseVersion = require('parse-version');

var androidns = "http://schemas.android.com/apk/res/android";

class Manifest{
    constructor(){
        this._xml = null;
    }

    // #region Properties

    get version() { 
        var v = this._xml.getAttribute(androidns,"versionName"); 
        v += "." + this._xml.getAttribute(androidns,"versionCode"); 
        return parseVersion(v); 
    }
    set version(v) 
    { 
        var version = parseVersion(v); 
        this._xml.setAttribute(androidns,"versionName", version.major + "." + version.minor + "." + version.patch); 
        this._xml.setAttribute(androidns,"versionCode", version.build + ""); 
    }
    
    get bundleIdentifier() { return this._xml.getAttribute("package"); }
    set bundleIdentifier(v) { this._xml.setAttribute("package", v);  }

    get displayName() { return this._xml.firstChild("application").getAttribute(androidns,"label"); }
    set displayName(v) { this._xml.firstChild("application").setAttribute(androidns, "label", v);  }

    // # region Loading

    load(args, cb) {
        var manifest = args.file || "Info.plist";
        var manifestContent = args.content || fs.readFileSync(manifest, 'utf8');
        var _this = this;
        XML.deserialize(manifestContent, function(err, plist) {
            if (err) return cb(err); 
            _this._xml = plist;
            cb(null,_this);
        });
    }

    save(args, cb) {
        var output = args.file;
        var _this = this;
        this._xml.serialize(function(err,xml){
            if (err) return cb(err); 
            try {
                fs.writeFileSync(output, xml, 'utf8');
                cb(null,_this);
            } catch (error) {
                cb(err);
            }
        }) 
    }
}

module.exports = Manifest;