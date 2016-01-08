

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
        dist: 'dist/'
    };
    var c = {
        dist: {
            concat: p.temp+'MenuService.js',
            dist: p.dist+'MenuService.js',
            build: p.www+'MenuService.js',
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
            build:[p.www,p.dist],
            temp:[p.temp]
        },
        concat:{
            build:{
                src:[
                    p.dev+ 'js/lib/angular/angular.min.js',
                    p.dev+ 'js/lib/angular/*',
                    p.dev+ 'js/lib/*',
                    p.dev+ 'js/config.js',
                    p.dev+ 'js/**',
                ],
                dest: c.js.concat
            },
            dist:{
                src:[
                    p.dev+ 'build/prefix.txt',
                    p.dev+ 'build/main.js',
                    p.dev+ 'build/classes/**',
                    p.dev+ 'build/**',
                    p.dev+ 'build/sufix.txt',
                ],
                dest: c.dist.concat
            },
            css:{
                src:[
                    p.dev+ 'css/index.css',
                    p.dev+ 'css/**.css',
                ],
                dest: c.css.concat
            }
        },
        cssmin:{
            build:{
                files:[{
                    src: [ c.css.concat ],
                    dest: c.css.build
                }]
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
            },
            test:{
                files: [{
                    //expand: true,
                    //cwd: p.dev+'js',
                    src:[ c.js.concat ],
                    dest: c.js.build
                }]
            }
        },
        copy:{
            dist:{
                files:[{
                    src: c.dist.build,
                    dest: c.dist.dist
                }]
            },
            build:{
                files:[{
                    expand: true,
                    cwd: p.dev,
                    src: 'img/**',
                    dest: p.www
                },{
                    expand: true,
                    cwd: p.dev,
                    src: p.dev+'svg/**',
                    dest: p.www
                },{
                    expand: true,
                    cwd: p.dev,
                    src: 'paginas/**',
                    dest: p.www
                },{
                    expand: true,
                    cwd: p.dev,
                    src: '**.html',
                    dest: p.www
                }]
            }
        }
    });
    
    grunt.registerTask('default',['clean','concat','uglify','cssmin','copy']); // ,'clean:temp'
    
};
