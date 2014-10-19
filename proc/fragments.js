exports.fab_spray = function(socket) {
  return {
    "type": "build",
    "filename": "/pa/effects/specs/fab_combat_spray.pfx",
    "bone": socket,
    "offset": [
      0,
      0,
      0
    ],
    "orientation": [
      0,
      0,
      0
    ]
  }
}

exports.fab_audio = function() {
  return {
    "cue": "/SE/Construction/Fab_contruction_beam_loop",
    "flag": "build_target_changed",
    "should_start_func": "has_build_target",
    "should_stop_func": "no_build_target"
  }
}

exports.dup = function(obj) {
  return JSON.parse(JSON.stringify(obj))
}
