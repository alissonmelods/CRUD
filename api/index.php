<?php 
require_once 'vendor/autoload.php'; 

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Lpweb\AngularPostRequestServiceProvider;

date_default_timezone_set('America/Araguaina');
setlocale(LC_ALL, 'pt_BR.utf-8');

$app = new Silex\Application();
$app['debug'] = true;
$app->register(new AngularPostRequestServiceProvider());

function database()
{
	$config = new \Doctrine\DBAL\Configuration();
	$connectionParams = array(
        'driver' => 'pdo_mysql',
        'host' => 'localhost',
        'dbname' => 'teste',
        'user' => 'root',
        'password' => '',
        'charset' => 'utf8',
	);
	return \Doctrine\DBAL\DriverManager::getConnection($connectionParams, $config);
}

$db = database();

//USUÁRIO**********************************************************************************************
//validação login
//retorna lista de usuários
$app->get('/usuarios', function() use($app, $db)
{

    $sql = "SELECT * FROM tb_pessoa";
    $query = $db->executeQuery($sql);
    $usuarios = $query->fetchAll();
    return $app->json($usuarios);
});

//cadastrar usuario
$app->post('/cadastro-usuario', function(Application $app, Request $request) use($db)
{
    $id = $request->request->get('id');
    $nome = $request->request->get('nome');
    $idade = $request->request->get('idade');
    $r = 0;

    if($id)
    {
        $sql = "UPDATE tb_pessoa SET nome = ?, idade = ? WHERE id = ?";
        $r = $db->executeUpdate($sql, array($nome, $idade, $id));
    }
    else
    {
        $sql = "INSERT INTO tb_pessoa(nome, idade) VALUES(?, ?)";
        $db->executeUpdate($sql, array($nome, $idade));
        $r = $db->lastInsertId();
    }

    return $r;
});
 
//retorna um usuário
$app->get('/usuario/{id}', function($id) use($app, $db)
{
    $sql = "SELECT * FROM tb_pessoa WHERE id = ?";
    $query = $db->executeQuery($sql, array($id));
    $usuario = $query->fetch();
    return $app->json($usuario);
});

//excluir um usuário
$app->delete('/usuario-excluir/{id}', function($id) use($app, $db)
{
    $sql = "DELETE FROM tb_pessoa WHERE id = ?";
    $r = $db->executeUpdate($sql, array($id));
    return $r;
});

/*$app->get('/usuarios2', function() use($app, $db)
{
    $sql = "SELECT * FROM tb_usuario ORDER BY id";
    $query = $db->executeQuery($sql);
    $usuarios = $query->fetchAll();
    return $app->json($usuarios);
});*/


$app->run();
?>