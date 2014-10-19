module.exports = function(media) {
  return {
    mex: {
      targets: [
        'pa/units/land/metal_extractor/metal_extractor.json',
        'pa/units/land/metal_extractor_adv/metal_extractor_adv.json'
      ],
      process: function(spec) {
        delete spec.unit_types
      }
    },
    base_feature: {
      targets: [
        'pa/terrain/generic/base_feature.json'
      ],
      process: function(spec) {
        spec.max_health = 10 // changing this is easier than all the trees
        spec.metal_value = 5 * spec.max_health * 10
        spec.reclaimable = true
        spec.damageable = true // required for reclaim
      }
    },
    features: { // these just have to exist in the mod to pick up the base changes
      targets: [
        'pa/terrain/*/features/*.json'
      ]
    },
    rocks: {
      targets: [
        'pa/terrain/*/features/base*rock*.json'
      ],
      process: function(spec) {
        spec.max_health = 25
        spec.metal_value = 10 * spec.max_health * 10
      }
    },
    metal: {
      targets: [
        'pa/terrain/metal/features/base_metal_feature.json'
      ],
      process: function(spec) {
        spec.max_health = 100
        spec.metal_value = 50 * spec.max_health * 10
      }
    },
    special_points: { // oh dear, that would have been amusing...
      targets: [
        'pa/effects/features/control_point_01.json',
      ],
      process: function(spec) {
        spec.reclaimable = false
        spec.damageable = false
      }
    },
    metal_spots: {
      targets: [
        'pa/terrain/generic/base_metal.json',
        'pa/effects/features/metal_splat_02.json'
      ],
      process: function(spec) {
        spec.max_health = 1000
        spec.metal_value = 2000 * spec.max_health * 10
      }
    }
  }
}
