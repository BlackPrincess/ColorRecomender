module.exports = (grunt) ->
  
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-less'
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

    less:
      compile: 
        options: [
          compress:true
        ]
        files: [
          "dist/index.min.css":"less/index.less"
        ]
        


    watch:
      coffee:
        files: "src/**/*.coffee",
        tasks: ["build"]
      less:
        files: "less/**/*.less",
        tasks: ["build"]

    concat:
      coffee:
        src:[
          "build/index.js"
        ]
        dest: "dist/index.js"

    uglify:
      coffee:
        src: "dist/index.js"
        dest: "dist/index.min.js"

    jstestdriver:
      files: [
        'JsTestDriver.conf'
      ]
        

  grunt.registerTask "run", ["coffee", "less", "concat", "uglify", "watch"]
  grunt.registerTask "build", ["coffee", "less", "concat", "uglify"]