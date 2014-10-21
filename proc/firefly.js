var fragments = require('./fragments')
module.exports = function(media) {
  return {
    firefly: {
      src: [
        'pa/units/air/air_scout/air_scout.json',
        'pa/units/land/fabrication_bot_combat/fabrication_bot_combat.json'
      ],
      cwd: media,
      dest: 'pa/units/air/air_scout/air_scout.json',
      process: function(spec, cf) {
        spec.description = "Scout - fast scout armed only with a extremely lightweight reclaim lathe."
        spec.tools = [{spec_id:'/pa/units/air/air_scout/air_scout_build_arm.json'}]
        spec.fx_offsets = [fragments.fab_spray('bone_root')]
        spec.fx_offsets[0].offset = [0, -4, 0]
        spec.fx_offsets[0].orientation = [0, -45, 0]
        spec.audio.loops.build = fragments.fab_audio()
        spec.buildable_types = 'MetalProduction'
        spec.can_only_assist_with_buildable_items = true
        spec.command_caps.push('ORDER_Reclaim', 'ORDER_Build')
        return spec
      }
    },
    firefly_buildarm: {
      src: [
        'pa/units/land/fabrication_bot_combat/fabrication_bot_combat_build_arm.json'
      ],
      cwd: media,
      dest: 'pa/units/air/air_scout/air_scout_build_arm.json',
      process: function(ba) {
        delete ba.auto_repair
        ba.max_range = 50
        ba.construction_demand = {
          metal: 1,
          energy: 0
        }
        return ba
      }
    }
  }
}
