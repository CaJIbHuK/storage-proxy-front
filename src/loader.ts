/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  // map tells the System loader where to look for things
  // [`node_modules/core-js/client/shim.min.js`, `vendor/core-js/shim.min.js`],
  //   [`node_modules/zone.js/dist/zone.js`, `vendor/zone.js/`],
  //   [`node_modules/reflect-metadata/Reflect.js`, `vendor/reflect-metadata/`],
  //   [`node_modules/rxjs/bundles/Rx.min.js`, `vendor/rxjs/`],

  var map = {
    'app' : 'app',
    '@angular' : 'vendor/@angular',
    '@angular/platform-browser-dynamic' : 'vendor/@angular/platform-browser-dynamic.umd.js',
    '@angular/platform-browser' : 'vendor/@angular/platform-browser.umd.js',
    '@angular/core' : 'vendor/@angular/core.umd.js',
    '@angular/common' : 'vendor/@angular/common.umd.js',
    '@angular/compiler' : 'vendor/@angular/compiler.umd.js',
    '@angular/forms' : 'vendor/@angular/forms.umd.js',
    '@angular/http' : 'vendor/@angular/http.umd.js',
    '@angular/upgrade' : 'vendor/@angular/upgrade.umd.js',
    'zone.js/dist/*' : 'vendor/zone.js/*',
    'systemjs/dist/*' : 'vendor/systemjs/*',
    'core-js/client/*' : 'vendor/core-js/*',

    // 'rxjs' : 'vendor/rxjs',
    // 'rxjs/Observable' : 'vendor/rxjs/Rx.min',
    // 'rxjs/observable/merge' : 'vendor/rxjs/Rx.min',
    // 'rxjs/operator/share' : 'vendor/rxjs/Rx.min',
    // 'rxjs/Subject' : 'vendor/rxjs/Rx.min',
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app' : {main : 'main.js', defaultExtension : 'js'},
    // 'rxjs' : {defaultExtension : 'js'},
  };

  // var ngPackageNames = [
  //   'common',
  //   'compiler',
  //   'core',
  //   'forms',
  //   'http',
  //   'platform-browser',
  //   'platform-browser-dynamic',
  //   'router',
  //   'router-deprecated',
  //   'upgrade',
  // ];
  // // Individual files (~300 requests):
  // function packIndex(pkgName) {
  //   packages['@angular/' + pkgName] = {main : 'index.js', defaultExtension : 'js'};
  // }
  // //
  // // Bundled (~40 requests):
  // function packUmd(pkgName) {
  //   packages['@angular/' + pkgName] = {main : 'bundles/' + pkgName + '.umd.js', defaultExtension : 'js'};
  // }
  //
  // // Most environments should use UMD; some (Karma) need the individual index files
  // var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // // Add package entries for angular packages
  // ngPackageNames.forEach(setPackageConfig);
  var config = {
    map : map,
    packages : packages,
  };
  // SystemJS.set('rxjs/Rx', System.newModule(window.Rx));
  SystemJS.config(config);

})(this);