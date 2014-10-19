var spec = require('./lib/spec')
var prompt = require('prompt')
prompt.start()

var modPath = '../../server_mods/com.wondible.pa.junkyard_wars/'
var stream = 'stable'
var media = require('./lib/path').media(stream)
var build = 'ui/main/shared/js/build.js'

var extend = function(obj, by) {
  for (var p in by) {
    if (by.hasOwnProperty(p)) {
      obj[p] = by[p]
    }
  }
}

var merge = function(target) {
  for (var i in arguments) {
    if (i != 0) {
      extend(target, arguments[i])
    }
  }
}

module.exports = function(grunt) {
  // Project configuration.
  var config = {
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
      }
    }
  };

  merge(config.proc, require('./proc/features')(media))
  merge(config.proc, require('./proc/basic_comfab')(media))
  merge(config.proc, require('./proc/adv_comfab')(media))
  merge(config.proc, require('./proc/inferno')(media))

  grunt.initConfig(config)

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-json-schema');

  grunt.registerMultiTask('proc', 'Process unit files', function() {
    if (this.data.targets) {
      var specs = spec.copyPairs(grunt, this.data.targets, media)
      spec.copyUnitFiles(grunt, specs, this.data.process)
    } else {
      var specs = this.filesSrc.map(function(s) {return grunt.file.readJSON(media + s)})
      var out = this.data.process.apply(this, specs)
      grunt.file.write(this.data.dest, JSON.stringify(out, null, 2))
    }
  })

  // Default task(s).
  grunt.registerTask('default', ['proc', 'json_schema', 'jsonlint', 'copy:mod']);

};

