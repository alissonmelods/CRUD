(function(){ 

var API_BASE = '/estagio/api';

var app = angular.module('app', ['ngRoute', 'angular-loading-bar']);

app.config(
	function($routeProvider)
	{
		$routeProvider
		.when('/',
		{
			templateUrl: 'views/login/login.html',
			controller: 'LoginController'
		})
		.when('/dashboard',
		{
			templateUrl: 'views/dashboard/dashboard.html',
			controller: 'DashboardController'
		});
	}
);
 
app.controller('LoginController', function($rootScope, $scope, $http, $location, usuariosService) 
{       
    $scope.logar = function(usuario)
	{
		console.log(usuario);
		usuariosService.validaLogin(usuario);
	};
});

app.service('usuariosService', function($rootScope, $http, $location){

	this.validaLogin = function(user){
		$http.post(API_BASE + '/usuario', user)		
		.success(function(response)
		{
			if(response) 
			{
				delete response.senha;
				$rootScope.usuarioLogado = response;
				alert('Seja bem vindo!');
				$location.path('/dashboard');
			} 
			else 
			{
				alert('Nome de usuário ou senha incorretos! Por favor, tente novamente.');
			}
		});
	}
});

app.run(function ($rootScope, $location){
	var rotasBloqueadasUsuariosNaoLogados = ['/dashboard', '/acesso1', '/acesso2', '/acesso3'];
	var rotasBloqueadasUsuariosComuns = ['/acesso3'];

	$rootScope.$on('$locationChangeStart', function(){
		if ($rootScope.usuarioLogado == null && rotasBloqueadasUsuariosNaoLogados.indexOf($location.path()) != -1) {
			alert('Acessece com usuário e senha!');
			$location.path('/');
		}else
		if ($rootScope.usuarioLogado != null && rotasBloqueadasUsuariosComuns.indexOf($location.path()) != -1 && $rootScope.usuarioLogado.tipo == 2) {
			alert('Acessesso restrito!');
			$location.path('/dashboard');
		}
	});
});

})();