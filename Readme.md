# Firebox

Application runtime shared with [Firefox][] that can be used to create
cross platform desktop applications such as [Firefox][] itself using web technologies. Applications packages are just [Firefox OS Packged Apps][FxApps].


## Usage

Commonly you would install firebox as a `devDependency` of your npm package / application and run it as such:

```sh
node ./node_modules/firebox/firebox.js ./manifest.webapp
```

Argument passed is a path to an application [manifest](https://developer.mozilla.org/en-US/Apps/Build/Manifest) which is json file with information about the application (follow the link for details).

Commonly one would also add a `start` script to `package.json` to just
use `npm start` for lunching app.

Please note that firebox expects to find a nightly build of firefox on your system in order to borrow it's runtime & will fail if it's not installed.


It is also possible to just use Firefox [Nightly][] build by pointing it to firebox, although in that case usage is little more complicated:

```sh
/Applications/FirefoxNightly.app/Contents/MacOS/firefox -app /path/to/firebox/application.ini /path/to/app/manifest.webapp
```

As a matter of fact `firebox.js` script does the same it just finds a Firefox installation on the system.


## Debugging

During development you may want to use debugger, which is possible by passing additional arguments:

```sh
# using node
node ./node_modules/firebox/firebox.js ./manifest.webapp --debugger 6000

# using firefox
/Applications/FirefoxNightly.app/Contents/MacOS/firefox -app /path/to/firebox/application.ini /path/to/app/manifest.webapp --debugger 6000
```

If application was lunched with a `--debugger` flag it will listen on given port (in this case `6000`) to which you can connect via Firefox [WebIDE][].

## Examples

You can check actual [application example][symbiont] to see how all pieces fit together.


[Firefox]:https://www.mozilla.org/en-US/firefox/desktop/
[XULRunner]:https://developer.mozilla.org/en-US/docs/Mozilla/Projects/XULRunner
[node-webkit]:https://github.com/rogerwang/node-webkit
[XUL]:https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XUL
[XPCOM]:https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM
[JSCTypes]:https://developer.mozilla.org/en-US/docs/Mozilla/js-ctypes
[Nightly]:https://nightly.mozilla.org/
[WebIDE]:https://developer.mozilla.org/en-US/docs/Tools/WebIDE
[FxApps]:https://developer.mozilla.org/en-US/Marketplace/Options/Packaged_apps
[symbiont]:https://github.com/gozala/symbiont
