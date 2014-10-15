# Junkyard Wars

Most metal comes via reclaim.

- All units leave wrecks.
- All features are reclaimable (rocks, trees, random metal bits on metal planets)
- Metal extractors produce 1 metal; possibly useful but not enough by itself
- Basic Combat Fab is the Junkyard Dog - a cheap scavenger that can also build mex.

## Planned Features

I'd like to review the role of combat fabs - auto-repair can actually be a problem when you are trying to reclaim things, and possibly turn metal extractors into reclaim towers.

## Trivia

- The metal_value in features doesn't seem to work.  Empirically, features return two ticks (2/10) of the fabricator's build rate.
- Features must be damageable to be reclaimable.
- The commander produces 1 metal to avoid a bug where you can't reclaim with zero metal income, zero metal in storage, and a metal demand.
- Reclaiming a unit takes half the metal killing it, and the other half in wreckage - wreckage can never be a closed economy, even discounting weapon damage.
- If a metal spot is reclaimed, the strategic icon stays, but you can't build on it anymore (unless you're the AI)

## Development

The generated project includes a `package.json` that lists the dependencies, but you'll need to run `npm install` to download them.

PA will upload **all files** in the mod directory, including `node_modules` and maybe even `.git` - you probably don't want to use this in `server_mods` directly, unless you really like waiting.  The template is set up run to run as a project within a peer directory of `server_mods` - I use `server_mods_dev/mod_name`.  The task `grunt copy:mod` will copy the mod files to `../../server_mods/identifier`, you can change the `modPath` in the Gruntfile if you want to run it from somewhere else.

### Available Tasks

- copy:build - copy build.js into the mod
- copy:mod - copy the mod files into server_mods
- proc - copy vanilla unit files, process them, and write into mod.  Number of subtasks but usually run together.
- jsonlint - lint all the mod json files
- json_schema - partial validation of mod json files format using schema by exterminans https://forums.uberent.com/threads/wip-units-ammo-and-tools-json-validation-schema.60451/
- default: proc, json_schema, jsonlint, copy:mod
