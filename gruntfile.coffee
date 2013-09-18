module.exports = (grunt) ->
  
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.initConfig
    coffee:
      compile:
        files: [
          expand: true
          cwd: 'src/'
          src: ['**/*.coffee']
          dest: 'build/'
          ext: '.js'
        ]

    watch:
      coffee:
        files: "src/**/*.coffee",
        tasks: ["build"]

    concat:
      app:
        src:[
          "build/index.js"
        ]
        dest: "dist/index.js"

    uglify:
      app:
        src: "dist/index.js"
        dest: "dist/index.min.js"

    jstestdriver:
      files: [
        'JsTestDriver.conf'
      ]
        

  grunt.registerTask "run", ["coffee", "concat", "uglify", "watch"]
  grunt.registerTask "build", ["coffee", "concat", "uglify"]