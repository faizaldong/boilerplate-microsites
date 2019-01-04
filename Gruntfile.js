const projectLib = require('./lib/project');

const currentProject = process.env.PROJECT;
let currentPath = '';

if (currentProject === 'template') {
  currentPath += 'template';
} else {
  currentPath += 'projects/' + currentProject;
}

module.exports = function (grunt) {
  grunt.initConfig({

    currentPath: currentPath,

    sass: {
      dist: {
        // options: {
        //   sourcemap: 'none',
        // },
        files: [{
          expand: true,
          cwd: 'assets/<%= currentPath %>/sass',
          src: ['*.scss'],
          dest: 'public/<%= currentPath %>/css',
          ext: '.css'
        }]
      },
    },

    babel: {
      options: {
        sourceMap: false,
        presets: [
          ['env', {
            modules: false,
            targets: {
              browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
            },
          }],
          'stage-2',
        ],
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'assets/<%= currentPath %>/js',
          src: ['*.js'],
          dest: 'public/<%= currentPath %>/js',
          ext: '.min.js'
        }]
      },
    },

    uglify: {
      options: {
        mangle: false,
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'public/<%= currentPath %>/js',
          src: ['*.min.js'],
          dest: 'public/<%= currentPath %>/js',
          ext: '.min.js'
        }]
      },
    },

    prompt: {
      create: {
        options: {
          questions: [ 
            {
              config: 'project_name',
              type: 'input',
              message: 'Enter the project name',
              validate(value) {
                if (/^[A-Za-z0-9\-\_]+$/i.test(value)) {
                  return true;
                }
                return 'Only letters and numbers are allowed and no space';
              },
              filter(value) {
                return value.trim();
              },
            },
            // {
            // 	config: 'template',
            // 	type: 'confirm',
            // 	message: 'Do you want to use template ?'
            // }, 
          ],
          then(results) {
            projectLib.createProject(results);
          },
        },
      },
      remove: {
        options: {
          questions: [
            {
              config: 'project_name',
              type: 'input',
              message: 'Enter the project name that you want to remove',
              validate(value) {
                if (/^[A-Za-z0-9\-\_]+$/i.test(value)) {
                  return true;
                }
                return 'Only letters and numbers are allowed';
              },
              filter(value) {
                return value.trim();
              },
            },
            {
              config: 'remove',
              type: 'confirm',
              message: 'Are you sure you want to remove the project ?',
            }, 
          ],
          then(results) {
            if (results.remove) {
              projectLib.removeProject(results);
            }
          },
        },
      },
      duplicate: {
        options: {
          questions: [
            {
              config: 'duplicated_project',
              type: 'input',
              message: 'Enter the project name that you want to duplicte',
              validate(value) {
                if (/^[A-Za-z0-9\-\_]+$/i.test(value)) {
                  return true;
                }
                return 'Only letters and numbers are allowed';
              },
              filter(value) {
                return value.trim();
              },
            },
            {
              config: 'project_name',
              type: 'input',
              message: 'Enter the new project name',
              validate(value) {
                if (/^[A-Za-z0-9\-\_]+$/i.test(value)) {
                  return true;
                }
                return 'Only letters and numbers are allowed';
              },
              filter(value) {
                return value.trim();
              },
            },
          ],
          then(results) {
            projectLib.createProject(results);
          },
        },
      },
      rename: {
        options: {
          questions: [
            {
              config: 'old_project_name',
              type: 'input',
              message: 'The project that you want to rename',
              validate(value) {
                if (/^[A-Za-z0-9\-\_]+$/i.test(value)) {
                  return true;
                }
                return 'Only letters and numbers are allowed';
              },
              filter(value) {
                return value.trim();
              },
            },
            {
              config: 'new_project_name',
              type: 'input',
              message: 'Enter new project name',
              validate(value) {
                if (/^[A-Za-z0-9\-\_]+$/i.test(value)) {
                  return true;
                }
                return 'Only letters and numbers are allowed';
              },
              filter(value) {
                return value.trim();
              },
            },
          ],
          then(results) {
            projectLib.renameProject(results);
          },
        },
      },
    },
    watch: {
      jade: {
        files: ['./views/projects/**/*.jade', 'views/template/*.jade'],
        options: {
          livereload: true,
        },
      },
      sass: {
        files: ['assets/<%= currentPath %>/**/*.scss'],
        tasks: 'sass:dist',
        options: {
          event: ['changed'],
          livereload: true,
          spawn: false,
        },
      },
      js: {
        files: ['assets/<%= currentPath %>/**/*.js'],
        tasks: ['babel:dist', 'uglify:dist'],
        options: {
          event: ['changed'],
          livereload: true,
          spawn: false,
        },
      },
      express: {
        files: [
          'assets/<%= currentPath %>/*.js',
          'routes/*.js',
          'lib/*.js',
        ],
        tasks: ['express:dev'],
        options: {
          event: ['changed'],
          spawn: false,
          debouceDelay: 500,
          intruput: true
        }
      }
    },
    express: {
      dev: {
        options: {
          script: 'bin/www',
          livereload: false,
          harmony: true,
          background: true,
          debug: false,
        },
      },
      live: {
        options: {
          script: 'bin/www',
          livereload: false,
          harmony: true,
          background: false,
        },
      },
    },
  });
  
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['express:dev', 'watch']);

  grunt.registerTask('create', ['prompt:create']);
  grunt.registerTask('remove', ['prompt:remove']);
  grunt.registerTask('duplicate', ['prompt:duplicate']);
  grunt.registerTask('rename', ['prompt:rename']);
};
