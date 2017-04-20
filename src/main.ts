  SystemJS.import('./loader.js')
    .then(() => Promise.all([SystemJS.import('./app/app.module'), SystemJS.import('@angular/platform-browser-dynamic')]))
    .then(([app, platform]) => console.log(app) || console.log(platform) || platform.platformBrowserDynamic().bootstrapModule(app.AppModule));
