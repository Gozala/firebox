"use strict";

var Winreg = require("winreg");
var os = require("os");
var Promise = require("es6-promise").Promise;
var spawn = require("child_process").spawn;
var path = require("path");


var readRegistry = function(key, field) {
  return new Promise(function(resolve, reject) {
    var registry = new Winreg({
      hive: Winreg.HKLM,
      key: key
    });

    registry.get(field, function(error, data) {
      if (error) {
        reject(error)
      }
      else {
        resolve(data.value)
      }
    });
  });
}

var guessWindowsAppPath = function(root, name) {
  var programs = arch === "(64)" ? "ProgramFiles(x86)" :
                "ProgramFiles";
  return path.join(process.env[programs],
                   name,
                   "firefox.exe");
};

var resolveWindowsAppPath = function(id, arch) {
  var root = arch === "(64)" ? "\\Software\\Wow6432Node\\Mozilla" :
             "\\Software\\Mozilla\\";
  var name = resolveWindowsAppPath.names[id] || id;
  return readRegistry(path.join(root, appName),
                      "CurrentVersion").
    then(function(version) {
      return readRegistry(path.join(root, version, "Main"),
                          "PathToExe");
    }).catch(guessWindowsAppPath.bind(null, name, arch));
};
resolveWindowsAppPath.names = {
  // the default path in the beta installer is the same as the stable one
  "beta": "Mozilla Firefox",
  "devedition": "DeveloperEdition",
  "dev": "DeveloperEdition",
  "aurora": "DeveloperEdition",
  "nightly": "Nightly",
  "firefox": "Mozilla Firefox"
};

var resolveOSXAppPath = function(app, arch) {
  var appPath = resolveOSXAppPath.paths[app.toLowerCase()] ||
                app;

  return path.extname(appPath) != ".app" ? appPath :
         path.join(appPath, "Contents/MacOS/firefox-bin");
};
resolveOSXAppPath.paths = {
  "firefox": "/Applications/Firefox.app/Contents/MacOS/firefox-bin",
  "beta": "/Applications/FirefoxBeta.app/Contents/MacOS/firefox-bin",
  "dev": "/Applications/FirefoxDeveloperEdition.app/Contents/MacOS/firefox-bin",
  "devedition": "/Applications/FirefoxDeveloperEdition.app/Contents/MacOS/firefox-bin",
  "dev-edition": "/Applications/FirefoxDeveloperEdition.app/Contents/MacOS/firefox-bin",
  "aurora": "/Applications/FirefoxDeveloperEdition.app/Contents/MacOS/firefox-bin",
  "nightly": "/Applications/FirefoxNightly.app/Contents/MacOS/firefox-bin",
}

var resolveLinuxAppPath = function(app, arch) {
  var appName = resolveLinuxAppPath.names[app];
  var libName = arg == "(64)" ? "lib64" : "lib";

  return appName ? "/usr/" + libName + "/" + appName :
         app;
};
resolveLinuxAppPath.names = {
  "firefox": "firefox",
  "aurora": "firefox-developeredition",
  "dev-edition": "firefox-developeredition",
  "devedition": "firefox-developeredition",
  "dev": "firefox-developeredition",
  "nightly": "firefox-nightly",
  "beta": "firefox-beta"
};


var resolveAppPath = function(app, platform, arch) {
  arch = arch || os.arch();
  arch = /64/.test(arch) ? "(64)" : "";
  platform = platform || process.platform;

  platform = /darwin/i.test(platform) ? "osx" :
             /win/i.test(platform) ? "windows" + arch :
             /linux/i.test(platform) ? "linux" + arch :
            platform;

  var resolvePlatformAppPath = resolveAppPath[platform] ||
                               resolveAppPath[""];

  return Promise.resolve(resolvePlatformAppPath(app, arch));
}
resolveAppPath["windows"] = resolveWindowsAppPath;
resolveAppPath["osx"] = resolveOSXAppPath;
resolveAppPath["linux"] = resolveLinuxAppPath;
resolveAppPath[""] = function(app) { return app };
exports.resolveAppPath = resolveAppPath;


var params = process.argv.slice(process.argv.indexOf(module.filename) + 1)
var app = params.indexOf("--binary") >= 0 ? params[params.indexOf("--binary") + 1] :
          "nightly";

resolveAppPath(app).then(function(binary) {
  var args = [
    "-app",
    require.resolve("./application.ini"),
    path.resolve(params[0])
  ].concat(params.slice(1));

  var task = spawn(binary, args, {stdio: "inherit"});
});
