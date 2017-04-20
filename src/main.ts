  SystemJS.import('./loader.js')
    .then(() => Promise.all([SystemJS.import('./app/app.module'), SystemJS.import('@angular/platform-browser-dynamic')]))
    .then(([app, platform]) => platform.platformBrowserDynamic().bootstrapModule(app.AppModule));
