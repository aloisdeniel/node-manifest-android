var fs = require('fs');
var path = require('path');
var XML = require('xmlobject');
var parseVersion = require('parse-version');

var androidns = "http://schemas.android.com/apk/res/android";

class Manifest{
    constructor(){
        this._xml = null;
        this._dir = ".";
    }

    get isXamarinProject(){
        var dir = path.join(this._dir, "..");
        var files = fs.readdirSync(dir);
        var csproj = files.find(function(f) { return path.extname(f) === ".csproj"; });
        return csproj;
    }

    get resourceFolder(){
        if(this.isXamarinProject)
            return path.join(this._dir, "..", "Resources");
        return path.join(this._dir, "res");
    }

    /**
     * Find all resource files from "@mimap/name" or "@drawable/name" format.$
     * @param {*} res The resource link
     */
    resolveResources(res){
        if(res && res.startsWith("@")) {
            var parts = res.substring(1).split("/");
            var subfoldername = parts[0];
            var resname = parts[1];
            var resfolder = this.resourceFolder;
            var ressubfolders = fs.readdirSync(resfolder);
            var typesubfolders = ressubfolders.filter(f => path.basename(f).startsWith(subfoldername))
                                              .map(d => path.join(resfolder, d));

            var result = [];

            typesubfolders.forEach(folder => {
                var files = fs.readdirSync(folder);
                var file = files.find(f => path.basename(f).slice(0, - path.extname(f).length) == resname)
                if(file && path.extname(file) === ".png") result.push(path.join(folder, file));
            }, this);

            return result;
        }

        return res;
    }

    // #region Properties

    get version(){ 
        var v = this._xml.getAttribute(androidns,"versionName"); 
        v += "." + this._xml.getAttribute(androidns,"versionCode"); 
        return parseVersion(v); 
    }
    set version(v){ 
        var version = parseVersion(v); 
        this._xml.setAttribute(androidns,"versionName", version.major + "." + version.minor + "." + version.patch); 
        this._xml.setAttribute(androidns,"versionCode", version.build + ""); 
    }
    
    get bundleIdentifier() { return this._xml.getAttribute("package"); }
    set bundleIdentifier(v) { this._xml.setAttribute("package", v);  }

    get displayName() { return this._xml.firstChild("application").getAttribute(androidns,"label"); }
    set displayName(v) { this._xml.firstChild("application").setAttribute(androidns, "label", v);  }

    get icons(){ 
        var icon = this._xml.firstChild("application").getAttribute(androidns,"icon");
        return this.resolveResources(icon);
    }

    // # region Loading

    load(args, cb){
        var manifest = "AndroidManifest.xml";
        if(args.file){
            manifest = args.file;
            this._dir = path.dirname(manifest);
        }
        var manifestContent = args.content || fs.readFileSync(manifest, 'utf8');
        var _this = this;
        XML.deserialize(manifestContent, function(err, plist) {
            if (err) return cb(err); 
            _this._xml = plist;
            cb(null,_this);
        });
    }

    save(args, cb){
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