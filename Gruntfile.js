

module.exports = function (grunt) {
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    var c = {
        dev: 'src/',
        temp: 'www_temp',
        www: 'www',
    };
    
    // Project configuration.
    grunt.initConfig({
        clean:{
            
        },
        concat:{
            
        },
        cssmin:{
            
        },
        uglify:{
            
        },
        copy:{
            
        }
    });
    
    grunt.registerTask('default',[]);
    
};
