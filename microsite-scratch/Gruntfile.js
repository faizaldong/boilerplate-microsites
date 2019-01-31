module.exports = function(grunt) {
	grunt.initConfig({

	  sass: {
	    dist: {
	      files: {
	      	//destination						//source
	      	'public/css/style.css': 'assets/sass/style.scss',
	      	// 'public/css/mixin.css': 'assets/sass/mixin.scss'
	      }
	    }
	  },

		coffee: {
		  compile: {
		   files: {
		   	//destination							 //source
		    'public/js/script.coffee': 'assets/js/script.js'
		   }
		 }
		},

		cssmin: {
			build: {
			  src: 'public/css/style.css',
			  dest: 'public/css/style.min.css'
			}
		},

		concat: {
		  options: {
		    separator: '\n/*next file*/\n\n'  //this will be put between conc. files
		  },
		  dist: {
		    src: ['assets/js/script.js'],
		    dest: 'public/js/built.js'
		  }
		},

		uglify: {
		  build: {
		    files: {
		      'public/js/built.min.js': ['public/js/built.js']
		    }
		  }
		},

		watch: {
		  sass: {
		    files: '**/*.scss', // ** any directory; * any file
		    tasks: ['sass'],
		    options: {
		      livereload: 35729 // 35729 is the default port === true
		    }
		  },
		  coffee: {
		    files: 'public/js/*.coffee',
		    tasks: ['coffee']
		  },
		  concat: {
		    files: ['assets/js/script.js'],
		    tasks: ['concat']
		  },
		  uglify: {
		    files: 'public/js/built.js',
		    tasks: ['uglify'],
		    options: {
		      livereload: true
		    }
		  },
		  all: {
		    files: ['**/*.html'],
		    options: {
		      livereload: true
		    }
		  }
		}

	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [ 'sass', 'coffee', 'cssmin', 'concat', 'uglify', 'watch' ]);

};



