/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: ['js/*.js']
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
          base: './'
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  // Default task.
  grunt.registerTask('default', ['connect','watch']);

};
