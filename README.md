BART (Bay Area Rapid Transit) landscape app for [Urbit](http://urbit.org).

The Bart App Map was created by Trucy Phan (https://github.com/trucy/bart-map) and is used under 
the terms of the Creative Commons Attribution 3.0 Unported License.


# Installation
This app is based off of the [create-landscape-app](https://github.com/urbit/create-landscape-app) scaffolding.

To install, first boot your ship, and mount its pier using `|mount %` in the Dojo.

Then clone this repo, and create  a file called `.urbitrc` at the root of the repo directory
with the following contents:

```
module.exports = {
  URBIT_PIERS: [
    "/path/to/ship/home",
  ]
};
```

For instance, if the repo was cloned into the same directory as a planet with a pier
`zod`, you might make the path `../zod/home`.

Then run the following Unix commands from the root of the repo:
```
$ yarn
$ yarn run build
```

This will build and package the javascript files, and move them into the directory
specified in the `.urbitrc` file.

Finally, run `|commit %home` in your ship's Dojo to make Urbit aware of those files,
and then run `|start %barttile` to start the app. You should then see a `BART info`
tile on your Landscape home screen.

