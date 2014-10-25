var fragments = require('./fragments')
module.exports = function(media) {
  return {
    vanguard: {
      targets: [
        'pa/units/land/tank_heavy_armor/tank_heavy_armor.json'
      ],
      process: function(spec) {
        spec.description = "Heavy tank with excellent armor, and a powerful weapon and reclaim lathe"
        spec.tools[0].spec_id = '/pa/units/land/tank_heavy_armor/tank_heavy_armor_build_arm.json'
        spec.audio.loops.build = fragments.fab_audio()
        spec.fx_offsets = [fragments.fab_spray(spec.tools[0].muzzle_bone)]
        spec.buildable_types = 'MetalProduction | Wall'
        spec.can_only_assist_with_buildable_items = true
        spec.command_caps = [
          "ORDER_Move",
          "ORDER_Patrol",
          "ORDER_Assist",
          "ORDER_Reclaim",
          "ORDER_Repair",
          "ORDER_Build",
          "ORDER_Use"
        ]
      }
    },
    vanguard_buildarm: {
      src: [
        'pa/units/land/fabrication_bot_combat/fabrication_bot_combat_build_arm.json',
        'pa/units/land/tank_heavy_armor/tank_heavy_armor_tool_weapon.json'
      ],
      cwd: media,
      dest: 'pa/units/land/tank_heavy_armor/tank_heavy_armor_build_arm.json',
      process: function(ba, wep) {
        delete ba.auto_repair
        ba.max_range = 20
        ba.pitch_range = wep.pitch_range
        ba.pitch_rate = wep.pitch_rate
        ba.yaw_range = wep.yaw_range
        ba.yaw_rate = wep.yaw_rate
        ba.construction_demand = {
          metal: 200,
          energy: 20000
        }
        return ba
      }
    }
  }
}
