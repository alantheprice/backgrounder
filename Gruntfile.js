module.exports = function(grunt) {
  
  grunt.loadNpmTasks("grunt-ts");
  
  grunt.initConfig({
      ts: {
        default : {
          src: ["src/**/*.ts"],
          watch: ".",
          reference: "src/reference.ts",
          out: "dist/bkgdr.js",
        },
        options: {
          fast: "never",
          removeComments: true,
          declaration: true //generates ts.d files
        }
      }
  });
  
  grunt.registerTask("default", ["ts:default"]);
    
};