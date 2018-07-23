(function(){

var API_BASE = '../api';

var app = angular.module('app', ['ngRoute', 'angular-loading-bar', 'ui-notification', 'ngStorage']);
app.config(
	function($routeProvider)
	{
		$routeProvider
		.when('/',
		{
			templateUrl: 'views/usuario/lista-usuario.html',
			controller: 'UsuarioController'
		})
		.when('/cadastro-edicao-usuario',
		{
			templateUrl: 'views/usuario/cadastro-edicao-usuario.html',
			controller: 'UsuarioEditorController'
		})
		.when('/usuarios/:id/editor',
		{
			templateUrl: 'views/usuario/cadastro-edicao-usuario.html',
			controller: 'UsuarioEditorController'
		});
	}
);
 
app.controller('UsuarioController', function($scope, $http, $location, $routeParams)
{
	$http.get(API_BASE + '/usuarios')
	.then(function(response)
	{
		$scope.usuarios = response.data;
	});

	$scope.editar = function(usuario)
	{
		$location.path('/usuarios/' + usuario.id + '/editor');
	};

	$scope.excluir = function(usuario, index)
	{
		if(confirm('Tem certeza que deseja excluir: ' + usuario.nome + '?'))
		{
			$http.delete(API_BASE + '/usuario-excluir/' + usuario.id)
			.then(function(response)
			{
				$scope.usuarios.splice(index, 1);
				alert('Usuário excluido com sucesso!');
			});
		}
	}
});

app.controller('UsuarioEditorController', function($scope, $http, $location, $routeParams)
{
	if($routeParams.id)
	{
		$http.get(API_BASE + '/usuario/' + $routeParams.id)
		.success(function(response)
		{
			console.log(response);
			$scope.usuario = response;
		});
	}

	$scope.salvar = function(usuario)
	{
		console.log(usuario);
		$http.post(API_BASE + '/cadastro-usuario', usuario)
		.success(function(response)
		{
			alert('Os dados do usuario foram salvos com sucesso!');
			$location.path('/');
		});
		
	};
 
	$scope.cancelar = function()
	{
		$location.path('/')
	};
});

})();