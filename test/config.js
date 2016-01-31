
window.Module = angular.module('Module',['Menu','ngAnimate','ngTouch','ngRoute','ui.router']);
            
Module.config(['$stateProvider','$urlRouterProvider',
      function($stateProvider,$urlRouterProvider){
    // for any unmatched URL, this is the default URL
    $urlRouterProvider.otherwise('/');
}]);

var urls = [];
function registerUrl(name, view, desc){
  Module.config(['$stateProvider',function($stateProvider){
    var config = { url: '/'+name , views:{} };
    config.views[view || 'conteudo'] = { templateUrl: 'test/'+name+'/index.html' };
    $stateProvider.state( name, config );
    if( !desc ){
      desc = angular.uppercase( name[0] ) + name.substring(1);
    }
    urls.push({ name:name, desc:desc });
  }]);
}

Module.controller('Menu',['$scope',function($scope){
  $scope.menus = urls.sort(function(a,b){ return a.desc > b.desc? 1 : (a.desc < b.desc? -1 : 0) ; });
  
}]);
