# LCMM

Lightweight Cookie Middle-Man

## Purpose

`lcmm` exists to aid in the development process of `rattman`, the react client of tigerwatch. When `rattman` is run locally, it get served on localhost:3000. It checkes for the `skey` cookie and, since it doesn't find it the first time around, it redirects to api.tigerwatch.app/auth, which will take it on the standard authorization flow. However, the end target of this flow sets the skey cookie to `.tigerwatch.app` domains redirects the user to tigerwatch.app.

We need the cookie to be set for `localhost` instead, but we cannot set a `localhost` cookie from a non-`localhost` domain. As such, we use `lcmm.exe` which runns locally at port 8000, to handle setting the skey cookie.

Hitting the `/cb?skey=` route will set the value of the url parameter to the `skey` cookie, and redirect the user to `localhost:3000`, which is where `rattman` should be hosted.

In addition to this, there is a `api.tigerwatch.app/dev/auth` route that you can navigate to to begin the localhost version of the authorization flow. `Caroline` will take this and redirect you to shib pointing at `tigerspend.rit.edu/login.php?wason=http://localhost:8000` so we can intercept the cookie with `lcmm`.

## lcmm-ctl.ps1

There is a controller script, `lcmm-ctl.ps1`, to help abstract away some of the management of `lcmm`. There are three commands that can be passed to `lcmm-ctl`,

|command|description|
|---|---|
|`.\lcmm-ctl.ps1 start`|If the executable hasn't been built yet, build it. Then start `lcmm.exe` as a background process|
|`.\lcmm-ctl.ps1 stop`|Stop the process, if it is running|
|`.\lcmm-ctl.ps1 proc`|Return the powershell process object of `lcmm.exe` if it is running, otherwise it will say that `lcmm` is not running|






