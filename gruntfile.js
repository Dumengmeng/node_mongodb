module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            jade: {
                files: ['views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                // tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
        },
        nodemon: {
            dev: {
                options: {
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3001
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            target: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    })

    // 只要有文件添加、修改、删除，该模块就会重新执行我们注册好的任务
    grunt.loadNpmTasks('grunt-contrib-watch')

    // 实时监听app.js，若改文件有改动，则会实时重启app.js
    grunt.loadNpmTasks('grunt-contrib-nodemon')

    // 执行慢任务，如Sass、Coffee，可以优化他们的构建时间，也可以跑多个阻塞的任务，如watch、nodemon
    grunt.loadNpmTasks('grunt-concurrent')

    // 若开发时遇到语法等错误或警告时，grunt的服务不会被中断
    grunt.option('force', true)

    grunt.registerTask('default', ['concurrent'])
}