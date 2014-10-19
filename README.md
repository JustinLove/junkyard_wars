# Junkyard Wars

Most metal comes via reclaim.

- All units leave wrecks.
- All features are reclaimable (trees < rocks < random metal bits on metal planets)
- Metal spots are reclaimable for signifcant but finite metal
- Metal extractors have been removed.

### Units

Units with weapons retain them, so you may need to hold fire if you want all the metal from a live target.

- Basic Combat Fab is the Junkyard Dog - a cheap scavenger
- Advanced Combat Fab is a basic builder designed for heavy fire situations - a commander in all but uber cannon and death weapon.
- Inferno has a powerful short-range lathe for mopping up an enemy base and quickly mining metal spots.
- Vanguard has heavy reclaim tool; you won't like the power bill, but it usually doesn't need to operate for long.
- Firefly has a very weak lathe for picking up small rocks and trees
- Gunship has a moderate lathe for reclaim raiding.
- Sunfish has a basic relaim tool; the effect direction may be off since it doesn't have a turret.

## Planned Features

Currently in the exporatory phase; lots of tweaking and probably adding reclaim untis for all factories.  Might look for unit to replace metal extractors; tried reclaim towers but found them fiddly.

## Trivia

- There are lots of rounding or overshoot errors in the economy, but nobody notices in a streaming economy.
- It's possible to set feature reclaim value, it's just... odd.  You can get (metal_value/max_health)/10, plus some error based on the build power used.  In the typical case, a feature is either 25/25/10 or 25/10/10 for trees, basically 1 metal if you round up generously, and the fabber error dominates.
- Features must be damageable to be reclaimable.
- If a metal spot is reclaimed, the strategic icon stays, but you can't build on it anymore (unless you're the AI)
- You must shadow (at least certain) features for changes in base_feature take effect.
- The commander produces 1 metal to avoid a bug where you can't reclaim with zero metal income, zero metal in storage, and a metal demand.
- Reclaiming a unit takes half the metal killing it, and the other half in wreckage - wreckage can never be a closed economy, even discounting weapon damage.

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
