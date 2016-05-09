# depception

For when your app breaks due to dependency inception.

Install with `npm install -g depception`

```bash
$ depception ~/my-app/package.json

Here are the 20 most recent updates from dependency chain:
2016-05-08 23:15: qs 6.2.0 (via gulp-webserver > tiny-lr)
2016-05-08 19:59: csso 2.1.0 (via gulp-cssnano > cssnano > postcss-svgo > svgo)
2016-05-08 19:25: lodash 4.12.0 (via atlassian-soy-cli)
2016-05-08 07:29: normalize-url 1.5.2 (via gulp-cssnano > cssnano > postcss-normalize-url)
2016-05-08 01:36: core-js 2.4.0 (via karma)
2016-05-08 01:35: less 2.7.0 (via gulp-less)
2016-05-07 21:27: caniuse-db 1.0.30000464 (via gulp-cssnano > cssnano > autoprefixer)
2016-05-07 17:47: aws4 1.4.1 (via ci-npm-publish > npm-registry-client > request)
2016-05-07 08:24: arr-diff 3.0.0 (via gulp-watch > anymatch > micromatch)
2016-05-07 03:07: gulp-header 1.8.2
2016-05-06 14:51: boom 3.1.3 (via ci-npm-publish > npm-registry-client > request > hawk)
2016-05-06 10:49: babel-plugin-add-module-exports 0.2.0
2016-05-06 05:35: body-parser 1.15.1 (via karma)
2016-05-05 23:30: async 2.0.0-rc.4 (via handlebars)
2016-05-05 21:11: node-pre-gyp 0.6.28 (via gulp-watch > chokidar > fsevents)
2016-05-05 19:00: graceful-fs 4.1.4 (via gulp-sourcemaps)
2016-05-05 18:21: which 1.2.8 (via karma-chrome-launcher)
2016-05-05 17:22: gulp-if 2.0.1
2016-05-05 14:44: archiver-utils 1.2.0 (via karma-sauce-launcher > wd > archiver)
2016-05-05 09:27: expand-range 1.8.2 (via karma > expand-braces > braces)
```

You can also use `depception package.json <integer>` to control the number of results.
