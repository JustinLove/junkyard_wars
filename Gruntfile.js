var spec = require('./lib/spec')
var prompt = require('prompt')
prompt.start()

var modPath = '../../server_mods/com.wondible.pa.junkyard_wars/'
var stream = 'stable'
var media = require('./lib/path').media(stream)
var build = 'ui/main/shared/js/build.js'

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
    jsonlint: {
      all: {
        src: [
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
          spec.production.metal = 0
          spec.storage.metal = 2000
        }
      },
      mex: {
        targets: [
          'pa/units/land/metal_extractor/metal_extractor.json',
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
          spec.reclaimable = true
          spec.damageable = true // required for reclaim
        }
      },
      control_point: { // oh dear, that would have been amusing...
        targets: [
          'pa/effects/features/control_point_01.json'
        ],
        process: function(spec) {
          spec.reclaimable = false
          spec.damageable = false
        }
      },
      spot: { // can't set the reclaim value, so keep it buildable
        targets: [
          'pa/terrain/generic/base_metal.json'
        ],
        process: function(spec) {
          spec.reclaimable = false
          spec.damageable = false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-json-schema');

  grunt.registerMultiTask('proc', 'Process unit files', function() {
    var specs = spec.copyPairs(grunt, this.data.targets, media)
    spec.copyUnitFiles(grunt, specs, this.data.process)
  })

  // Default task(s).
  grunt.registerTask('default', ['proc', 'json_schema', 'jsonlint', 'copy:mod']);

};

