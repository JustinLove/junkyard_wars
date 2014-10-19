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

var dup = function(obj) {
  return JSON.parse(JSON.stringify(obj))
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
          'pa/anim/**/*.json',
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
            'pa/anim/**/*.json',
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
          'pa/units/land/land_barrier/land_barrier.json',
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
      adv_comfab_anim: {
        targets: [
          'pa/anim/anim_trees/fabrication_bot_combat_adv_anim_tree.json'
        ],
        process: function(spec) {
          var bt = spec.skeleton_controls[0]
          bt.child.weapon_index = 0

          var ft = dup(bt)
          ft.child.rotation_bone = 'bone_turretFront'
          ft.child.weapon_index = 1
          spec.skeleton_controls.push(ft)

          var bp = spec.skeleton_controls[1]
          bp.child.weapon_index = 0

          var fr = dup(bp)
          fr.child.rotation_bone = 'bone_recoil'
          fr.child.weapon_index = 1
          spec.skeleton_controls.push(ft)
        }
      },
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
      },
    },
    mashup: {
      adv_comfab: {
        src: [
          'pa/units/land/fabrication_bot_combat_adv/fabrication_bot_combat_adv.json',
          'pa/units/commanders/base_commander/base_commander.json'
        ],
        cwd: media,
        dest: 'pa/units/land/fabrication_bot_combat_adv/fabrication_bot_combat_adv.json',
        process: function(acf, com) {
          delete acf.atrophy_rate
          delete acf.atrophy_cool_down
          delete acf.guard_layer
          acf.buildable_types = com.buildable_types + " | Defense & FabBuild | Recon & FabBuild"
          acf.command_caps.push('ORDER_Attack')
          acf.description = "The combat fabricator is fully armored and armed to provide build support in heavy fire situations."
          acf.max_health = com.max_health
          acf.navigation = com.navigation
          acf.events.fired = {
            "effect_spec": "/pa/effects/specs/default_muzzle_flash.pfx socket_muzzleFront"
          }
          acf.tools = com.tools.filter(function(tool) {
            if (tool.spec_id == "/pa/tools/commander_build_arm/commander_build_arm.json") {
              tool.aim_bone = 'bone_turretBack'
              tool.muzzle_bone = 'socket_muzzleBack'
              tool.record_index = 0
            } else {
              tool.aim_bone = 'bone_turretFront'
              tool.muzzle_bone = 'socket_muzzleFront'
              tool.record_index = 1
            }

            return tool.spec_id != '/pa/tools/uber_cannon/uber_cannon.json'
          })
          return acf
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

