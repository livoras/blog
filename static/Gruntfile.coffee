module.exports = (grunt)->
  process.env.DEBUG = 'facility'
  coffeeify = require 'coffeeify'
  stringify = require 'stringify'

  grunt.initConfig
    clean: 
      bin: ['bin']

    browserify: 
      dev: 
        options:
          preBundleCB: (b)->
            b.transform(coffeeify)
            b.transform(stringify({extensions: ['.hbs', '.html', '.tpl', '.txt']}))
        expand: true
        flatten: true
        src: ['src/**/*.coffee']
        dest: 'bin/js/'
        ext: '.js'

    watch:
      compile:
        options:
          livereload: true
        files: ["src/**/*.coffee", "src/**/*.less", "src/**/*.hbs"]
        tasks: ["browserify:dev", "less:dev"]

    less:    
      dev:
        expand: true
        flatten: true
        cwd: 'src/'
        src: ['**/*.less']
        dest: 'bin/css/'
        ext: '.css'

      build:
        options:
          compress: true
        expand: true
        flatten: true
        cwd: 'src/'
        src: ['**/*.less']
        dest: 'bin/css/'
        ext: '.css'

    uglify:
      build:
        expand: true
        cwd: 'bin/js/'
        src: '**/*.js'
        dest: 'bin/js/'

  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-browserify"
  grunt.loadNpmTasks "grunt-contrib-less"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-uglify"

  grunt.registerTask "default", ->
    grunt.task.run [
      "clean:bin"
      "browserify:dev"
      "less:dev"
      "watch"
    ]

  grunt.registerTask "build", ['clean:bin', 'browserify', 'less:build', 'uglify']
