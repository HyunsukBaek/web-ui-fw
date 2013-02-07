module.exports = function( grunt ) {

	// project configuration
	grunt.initConfig({
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,

				// (function(){})() seems acceptable
				immed: false,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},

			globals: {
				jQuery: true,
				"$": true,

				// qunit globals
				// TODO would be nice to confine these to test files
				module: true,
				ok: true,
				test: true,
				asyncTest: true,
				same: true,
				start: true,
				stop: true,
				expect: true,

				// require js global
				define: true,
				require: true
			}
		},

		// TODO add test files here once we can specify different configs for
		//      different globs
		lint: {
			files: [ 'js/**/*.js', 'js/*/*.js' ]
		},

		global: {}

	});

	// set the default task.
	grunt.registerTask('default', 'lint');

	// unit tests
	grunt.loadNpmTasks( "grunt-junit" );

	// load the project's default tasks
	grunt.loadTasks( 'build/tasks');

	// A convenient task alias.
	grunt.registerTask('test', 'config:test:pages config:test junit');
};