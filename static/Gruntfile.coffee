module.exports = (grunt)->
  process.env.DEBUG = 'facility'

  grunt.initConfig
    clean: 
      bin: ['bin']

    browserify: 
      dev: 
        options:
          debug: true
          transform: ['coffeeify']
        expand: true
        flatten: true
        src: ['src/**/*.coffee']
        dest: 'bin/js/'
        ext: '.js'

    watch:
      compile:
        options:
          livereload: true
        files: ["src/**/*.coffee", "src/**/*.less"]
        tasks: ["browserify", "less"]

    less:    
      dev:
        expand: true
        flatten: true
        cwd: 'src/'
        src: ['**/*.less']
        dest: 'bin/css/'
        ext: '.css'

  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-browserify"
  grunt.loadNpmTasks "grunt-contrib-less"
  grunt.loadNpmTasks "grunt-contrib-watch"

  grunt.registerTask "default", ->
    grunt.task.run [
      "clean:bin"
      "browserify"
      "less"
      "watch"
    ]
