var fragments = require('./fragments')
module.exports = function(media) {
  return {
    gunship: {
      targets: [
        'pa/units/air/gunship/gunship.json'
      ],
      process: function(spec) {
        spec.description = "Gunship - reclaim raider that can build teleporters."
        spec.tools.forEach(function(tool) {
          tool.spec_id = '/pa/units/air/gunship/gunship_build_arm.json'
          spec.fx_offsets.push(fragments.fab_spray(tool.muzzle_bone))
        })
        spec.audio.loops.build = fragments.fab_audio()
        spec.buildable_types = 'MetalProduction | Teleporter'
        spec.can_only_assist_with_buildable_items = true
        spec.command_caps = [
          "ORDER_Move",
          "ORDER_Patrol",
          "ORDER_Assist",
          "ORDER_Reclaim",
          "ORDER_Repair",
          "ORDER_Build"
        ]
      }
    },
    gunship_buildarm: {
      src: [
        'pa/units/land/fabrication_bot_combat/fabrication_bot_combat_build_arm.json',
        'pa/units/air/gunship/gunship_tool_weapon.json'
      ],
      cwd: media,
      dest: 'pa/units/air/gunship/gunship_build_arm.json',
      process: function(ba, wep) {
        delete ba.auto_repair
        ba.max_range = wep.max_range
        ba.pitch_range = wep.pitch_range
        ba.pitch_rate = wep.pitch_rate
        ba.yaw_range = wep.yaw_range
        ba.yaw_rate = wep.yaw_rate
        // power is double because game only seems to use one buildarm
        ba.construction_demand = {
          metal: 40,
          energy: 800
        }
        return ba
      }
    }
  }
}
