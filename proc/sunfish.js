var fragments = require('./fragments')
module.exports = function(media) {
  return {
    sunfish: {
      targets: [
        'pa/units/sea/sea_scout/sea_scout.json'
      ],
      process: function(spec) {
        spec.description = "Scout - fast attack craft with light weaponary and reclaim lathe."
        var rec = fragments.dup(spec.tools[0])
        rec.spec_id = '/pa/units/sea/sea_scout/sea_scout_build_arm.json'
        spec.tools.push(rec)
        spec.audio.loops.build = fragments.fab_audio()
        spec.fx_offsets = [fragments.fab_spray(rec.muzzle_bone)]
        spec.fx_offsets[0].offset = [0, -6, 0]
        spec.fx_offsets[0].orientation = [0, -67, 0]
        spec.buildable_types = 'MetalProduction & Basic'
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
    sunfish_buildarm: {
      src: [
        'pa/units/land/fabrication_bot_combat/fabrication_bot_combat_build_arm.json',
        'pa/units/sea/sea_scout/sea_scout_tool_weapon.json'
      ],
      cwd: media,
      dest: 'pa/units/sea/sea_scout/sea_scout_build_arm.json',
      process: function(ba, wep) {
        delete ba.auto_repair
        ba.max_range = 20
        ba.pitch_range = wep.pitch_range
        ba.pitch_rate = wep.pitch_rate
        ba.yaw_range = wep.yaw_range
        ba.yaw_rate = wep.yaw_rate
        ba.construction_demand = {
          metal: 10,
          energy: 200
        }
        return ba
      }
    }
  }
}
