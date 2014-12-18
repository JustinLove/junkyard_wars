# Junkyard Wars

This mod has a set of units designed for reclaim-oriented games.

### Units

Basic units with weapons retain them, so you may need to hold fire if you want all the metal from a live target.  Modified units can build mex, and sometimes something else.

- Basic Combat Fab is the Junkyard Dog - a cheap scavenger which is also buildable by naval factories.
- Advanced Combat Fab provides long-range auto-repair, manual-reclaim, and defense emplacements.  It also has radar equal to it's fab range, hold CTRL to see the range.  Buildable by naval factories.
- Inferno has a powerful short-range lathe for mopping up an enemy base and quickly mining metal spots.  However, it's flamethrower is less effective than vanilla.
- Vanguard has a heavy reclaim tool; you won't like the power bill, but it usually doesn't need to operate for long. It can also build walls to further protect units units behind it.
- Firefly has a very weak lathe for picking up small rocks and trees, and can build radar for remote reconnaissance (albeit very, very slowly)
- Gunship has a moderate lathe for reclaim raiding, and can build teleporters to call in reinforcements.

## Related mods

- [Finite Metal](https://forums.uberent.com/threads/rel-server-finite-metal.65484/)
- [No Metal Commander](https://forums.uberent.com/threads/rel-server-no-metal-commander.65489/)
- [Reclaimable Features](https://forums.uberent.com/threads/rel-server-reclaimable-features.65453/)
- [Wreckage](https://forums.uberent.com/threads/rel-server-wreckage.65404/)

### Playing against the AI

If you cross Finite Metal with No Metal Commander, The AI is gonna have a bad day.  The AI is designed for a streaming economy and really doesn't get this mode.  I've tricked it into playing with x5 eco and metal_drain_check 0.12, but it will still get stalled pretty easily.

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
