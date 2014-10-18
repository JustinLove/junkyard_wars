var spec = require('./lib/spec')
var prompt = require('prompt')
prompt.start()

var modPath = '../../server_mods/com.wondible.pa.junkyard_wars/'
var stream = 'stable'
var media = require('./lib/path').media(stream)
var build = 'ui/main/shared/js/build.js'

var fab_spray = function(socket) {
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

var fab_audio = function() {
  return {
    "build": {
      "cue": "/SE/Construction/Fab_contruction_beam_loop",
      "flag": "build_target_changed",
      "should_start_func": "has_build_target",
      "should_stop_func": "no_build_target"
    }
  }
}

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    copy: {
      build: {
        files: [
          {
            src: media + build,
            dest: build,
          },
        ],
      },
      mod: {
        files: [
          {
            src: [
              'modinfo.json',
              'LICENSE.txt',
              'README.md',
              'CHANGELOG.md',
              'ui/**',
              'pa/**'],
            dest: modPath,
          },
        ],
      },
    },
    clean: [modPath],
    jsonlint: {
      all: {
        src: [
          'pa/effects/**/*.json',
          'pa/terrain/**/*.json',
          'pa/ammo/**/*.json',
          'pa/tools/**/*.json',
          'pa/units/**/*.json'
        ]
      },
    },
    json_schema: {
      all: {
        files: {
          'lib/schema.json': [
            'pa/effects/**/*.json',
            'pa/terrain/**/*.json',
            'pa/ammo/**/*.json',
            'pa/tools/**/*.json',
            'pa/units/**/*.json'
          ]
        },
      },
    },
    proc: {
      wreckage: {
        targets: [
          'pa/units/air/**/base_*.json',
          'pa/units/land/**/base_*.json',
          'pa/units/orbital/**/defense_satellite.json',
          'pa/units/orbital/**/orbital_factory.json',
          'pa/units/orbital/**/orbital_fighter.json',
          'pa/units/orbital/**/base_*.json',
          'pa/units/sea/**/base_*.json'
        ],
        process: function(spec) {
          spec.wreckage_health_frac = 1
        }
      },
      commander: {
        targets: [
          'pa/units/commanders/base_commander/base_commander.json'
        ],
        process: function(spec) {
          spec.wreckage_health_frac = 1
          spec.production.metal = 1
          spec.storage.metal = 5000
        }
      },
      basic_comfab: {
        targets: [
          'pa/units/land/fabrication_bot_combat/fabrication_bot_combat.json'
        ],
        process: function(spec) {
          spec.build_metal_cost = 45
          spec.max_health = 10
          spec.buildable_types = 'MetalProduction & Basic'
          spec.description = 'Scavenger - Able to reclaim, and build metal extractors'
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
      },
      mex: {
        targets: [
          'pa/units/land/metal_extractor_adv/metal_extractor_adv.json'
        ],
        process: function(spec) {
          spec.production.metal = 1
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
          'pa/terrain/generic/base_metal.json'
        ],
        process: function(spec) {
          spec.max_health = 1000
          spec.metal_value = 2000 * spec.max_health * 10
        }
      },
    },
    mashup: {
      adv_mex: {
        src: [
          'pa/units/land/metal_extractor_adv/metal_extractor_adv.json',
          'pa/units/land/air_defense_adv/air_defense_adv.json'
        ],
        cwd: media,
        dest: 'pa/units/land/metal_extractor_adv/metal_extractor_adv.json',
        process: function(mex, ld) {
          delete mex.atrophy_rate
          delete mex.atrophy_cool_down
          mex.build_metal_cost = 100
          mex.max_health = 100
          mex.area_build_separation = 20
          mex.description = "Can be ordered to reclaim (or repair) with a high-power, short-range lathe"
          delete mex.feature_requirements
          mex.mesh_bounds = ld.mesh_bounds
          mex.model = ld.model
          delete mex.production
          delete mex.replaceable_units
          mex.tools = ld.tools
          mex.tools[0].spec_id = '/pa/units/land/metal_extractor_adv/metal_extractor_adv_build_arm.json'
          mex.audio.loops = fab_audio()
          mex.fx_offsets = mex.tools[0].muzzle_bone.map(fab_spray)
          mex.buildable_types = "MetalProduction"
          mex.can_only_assist_with_buildable_items = true
          mex.recon.observer.items.push({
            "channel": "radar", 
            "layer": "surface", 
            "radius": 20, 
            "shape": "capsule", 
            "uses_energy": false
          })
          mex.unit_types[0] = 'UNITTYPE_Mobile' // replacing structure
          mex.unit_types.push('UNITTYPE_Construction')
          mex.navigation = {
            "acceleration": 0,
            "brake": 0,
            "move_speed": 0,
            "turn_in_place": false,
            "turn_speed": 0,
            "type": "amphibious"
          }
          mex.command_caps = [
            "ORDER_Build",
            "ORDER_Reclaim",
            "ORDER_Repair",
            "ORDER_Assist"
          ]
          return mex
        }
      },
      adv_mex_tool: {
        src: [
          'pa/units/land/fabrication_bot_combat/fabrication_bot_combat_build_arm.json'
        ],
        cwd: media,
        dest: 'pa/units/land/metal_extractor_adv/metal_extractor_adv_build_arm.json',
        process: function(spec) {
          spec.construction_demand.metal = 50
          spec.construction_demand.energy = 1000
          spec.max_range = 20
          delete spec.auto_repair
          return spec
        }
      },
      mex: {
        src: [
          'pa/units/land/metal_extractor/metal_extractor.json',
          'pa/units/land/laser_defense_single/laser_defense_single.json'
        ],
        cwd: media,
        dest: 'pa/units/land/metal_extractor/metal_extractor.json',
        process: function(mex, ld) {
          delete mex.atrophy_rate
          delete mex.atrophy_cool_down
          mex.build_metal_cost = 150
          mex.max_health = 1000
          mex.area_build_separation = 200
          mex.display_name = "Reclaim Tower"
          mex.description = "Can be ordered to reclaim (or repair) with a low-power, long-range lathe"
          delete mex.feature_requirements
          mex.mesh_bounds = ld.mesh_bounds
          mex.model = ld.model
          delete mex.production
          delete mex.replaceable_units
          mex.tools = ld.tools
          mex.tools[0].spec_id = '/pa/units/land/metal_extractor/metal_extractor_build_arm.json'
          mex.audio.loops = fab_audio()
          mex.fx_offsets = mex.tools[0].muzzle_bone.map(fab_spray)
          mex.buildable_types = "MetalProduction"
          mex.can_only_assist_with_buildable_items = true
          mex.recon.observer.items.push({
            "channel": "radar", 
            "layer": "surface", 
            "radius": 100, 
            "shape": "capsule", 
            "uses_energy": false
          })
          mex.unit_types[0] = 'UNITTYPE_Mobile' // replacing structure
          mex.unit_types.push('UNITTYPE_Construction')
          mex.navigation = {
            "acceleration": 0,
            "brake": 0,
            "move_speed": 0,
            "turn_in_place": false,
            "turn_speed": 0,
            "type": "amphibious"
          }
          mex.command_caps = [
            "ORDER_Build",
            "ORDER_Reclaim",
            "ORDER_Repair",
            "ORDER_Assist"
          ]
          return mex
        }
      },
      mex_tool: {
        src: [
          'pa/units/land/fabrication_bot_combat/fabrication_bot_combat_build_arm.json'
        ],
        cwd: media,
        dest: 'pa/units/land/metal_extractor/metal_extractor_build_arm.json',
        process: function(spec) {
          spec.construction_demand.metal = 5
          spec.construction_demand.energy = 100
          spec.max_range = 100
          delete spec.auto_repair
          return spec
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-json-schema');

  grunt.registerMultiTask('proc', 'Process unit files', function() {
    var specs = spec.copyPairs(grunt, this.data.targets, media)
    spec.copyUnitFiles(grunt, specs, this.data.process)
  })

  grunt.registerMultiTask('mashup', 'Process unit files', function() {
    var specs = this.filesSrc.map(function(s) {return grunt.file.readJSON(media + s)})
    var out = this.data.process.apply(this, specs)
    grunt.file.write(this.data.dest, JSON.stringify(out, null, 2))
  })

  // Default task(s).
  grunt.registerTask('default', ['proc', 'mashup', 'json_schema', 'jsonlint', 'copy:mod']);

};

