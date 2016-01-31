

module.exports = function (grunt) {
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    var p = {
        dev: 'src/',
        temp: 'www_temp/',
        www: 'www/',
        www_build: 'www/build/',
        test: 'test/',
        test_build: 'test/build/',
        dist: 'dist/'
    };
    var c = {
        dist: {
            concat: p.temp+'MenuService.js',
            dist: p.dist+'MenuService.min.js',
            build: p.test_build+'MenuService.min.js',
            build_concat: p.test_build+'MenuService.js'
        },
        js: {
            concat: p.temp+'scripts.js',
            build: p.www+'scripts.js'
        },
        css: {
            concat: p.temp+'styles.css',
            build: p.www+'styles.css'
        }
    };
    
    // Project configuration.
    grunt.initConfig({
        clean:{
            build:[p.www,p.dist,p.test_build],
            temp:[p.temp]
        },
        concat:{
            dist:{
                src:[
                  p.dev+ 'prefix.txt',
                  p.dev+ 'main.js',
                  p.dev+ 'classes/**',
                  p.dev+ '**',
                  p.dev+ 'sufix.txt'
                ],
                dest: c.dist.concat
            },
            css:{
              src:[
                 p.test+ 'index.css',
                 p.test+ 'styles.css',
                 p.test+ '**.css',
                 p.test+ 'test/**/*.css'
              ],
              dest: c.css.build
            },
            js:{
              src:[
                p.test+ 'libs/angular/angular.min.js',
                p.test+ 'libs/angular/**',
                p.test+ 'libs/**',
                p.test+ 'libs/angular-touch.min.js',
                //p.test+ 'libs/ngTouch.min.js',
                p.test+ 'config.js',
                p.test+ '**.js',
                p.test+ 'test/**/*.js'
              ],
              dest: c.js.build
            }
        },
        uglify:{
            dist:{
                files: [{
                    //expand: true,
                    //cwd: p.dev+'build',
                    src:[ c.dist.concat ],
                    dest: c.dist.build
                }]
            }
        },
        copy:{
            dist:{
                files:[{
                    src: c.dist.build,
                    dest: c.dist.dist
                },{
                    src: c.dist.concat,
                    dest: c.dist.build_concat
                },{
                    expand: true,
                    cwd: p.temp,
                    src: '*.js',
                    dest: p.www_build
                },{
                    expand: true,
                    cwd: p.test,
                    src: ['img/**','**.html','test/**/*.html'],
                    dest: p.www+ ''
                }]
            }
        }
    });
    
    grunt.registerTask('default',['clean','concat','uglify','copy']); 
    
};
