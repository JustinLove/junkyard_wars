module.exports = function(media) {
  return {
    basic_comfab: {
      targets: [
        'pa/units/land/fabrication_bot_combat/fabrication_bot_combat.json'
      ],
      process: function(spec) {
        spec.build_metal_cost = 45
        spec.max_health = 10
        spec.buildable_types = 'MetalProduction & Basic'
        spec.description = 'Scavenger - Cheap, fast reclaim unit'
        spec.display_name = 'Junkyard Dog'
      }
    },
    basic_comfab_tool: {
      targets: [
        'pa/units/land/fabrication_bot_combat/fabrication_bot_combat_build_arm.json'
      ],
      process: function(spec) {
        delete spec.auto_repair
        spec.construction_demand = {
          energy: 200,
          metal: 10
        }
      }
    }
  }
}
