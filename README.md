# Mr. Driller

A simple tool to display drumming drills, and animate them with a metronome. You can find a
deployed instance of the app here:

https://samskivert.com/mrdriller/

## Building

This is mainly just a React app with a few extra bits. Built by esbuild, with few bells and
whistles. There's a `build.sh` script you can use which will generate a `mrdriller.zip` file that
you can unpack somewhere to serve up the app.

## Testing

You can run a local development version easily. Install the dependencies via `npm install` and then
run `node devserver.js` to start the esbuild development server. It will start up a test instance
on `http://localhost:8080`.

## Adding drills

The drills are defined in `src/drills.ts` and are hopefully reasonably self-explanatory. There are
a bunch of existing drills as examples. If your drill doesn't do anything esoteric, you can
probably add it easily, and if it does do something fancy then fire up your favorite vibe coder and
add support for what you need. The AIs love to work on simple React web projects.

## License

Mr. Driller was created by Michael Bayne, an aspiring dilettante taiko drummer. It's released under
the MIT license, so feel free to modify and use it however you like.
