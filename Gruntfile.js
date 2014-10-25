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
    }
  };

  merge(config.proc, require('./proc/basic_comfab')(media))
  merge(config.proc, require('./proc/adv_comfab')(media))
  merge(config.proc, require('./proc/inferno')(media))
  merge(config.proc, require('./proc/vanguard')(media))
  merge(config.proc, require('./proc/gunship')(media))
  merge(config.proc, require('./proc/firefly')(media))
  merge(config.proc, require('./proc/sunfish')(media))

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

