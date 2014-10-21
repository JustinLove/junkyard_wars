var fragments = require('./fragments')
module.exports = function(media) {
  return {
    inferno: {
      targets: [
        'pa/units/land/tank_armor/tank_armor.json'
      ],
      process: function(spec) {
        var rec = fragments.dup(spec.tools[0])
        rec.spec_id = '/pa/units/land/tank_armor/tank_armor_build_arm.json'
        spec.tools.push(rec)
        spec.audio.loops.build = fragments.fab_audio()
        spec.fx_offsets = [fragments.fab_spray(rec.muzzle_bone)]
        spec.buildable_types = 'MetalProduction'
        spec.can_only_assist_with_buildable_items = true
        spec.command_caps = [
          "ORDER_Move",
          "ORDER_Patrol",
          "ORDER_Attack",
          "ORDER_Assist",
          "ORDER_Reclaim",
          "ORDER_Build",
          "ORDER_Use"
        ]
      }
    },
    inferno_buildarm: {
      src: [
        'pa/units/land/fabrication_bot_combat/fabrication_bot_combat_build_arm.json',
        'pa/units/land/tank_armor/tank_armor_tool_weapon.json'
      ],
      cwd: media,
      dest: 'pa/units/land/tank_armor/tank_armor_build_arm.json',
      process: function(ba, wep) {
        delete ba.auto_repair
        ba.max_range = wep.max_range
        ba.pitch_range = wep.pitch_range
        ba.pitch_rate = wep.pitch_rate
        ba.yaw_range = wep.yaw_range
        ba.yaw_rate = wep.yaw_rate
        ba.construction_demand = {
          metal: 50,
          energy: 3000
        }
        return ba
      }
    }
  }
}
