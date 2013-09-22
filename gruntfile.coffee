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
          compress:true,
          yuicompress:true
        ]
        files: [
          "build/index.min.css":"less/index.less"
        ]
        


    watch:
      coffee:
        files: "src/**/*.coffee",
        tasks: ["build"]
      less:
        files: "less/**/*.less",
        tasks: ["build"]

    # concat:
    #   coffee:
    #     src:[
    #       "build/index.js"
    #     ]
    #     dest: "build/index.js"

    uglify:
      coffee:
        src: "build/index.js"
        dest: "build/index.min.js"

    jstestdriver:
      files: [
        'JsTestDriver.conf'
      ]
        

  grunt.registerTask "run", ["coffee", "less", "uglify", "watch"]
  grunt.registerTask "build", ["coffee", "less", "uglify"]