<?php
$host = "localhost";
$user = "root"; // seu usuário MySQL
$pass = "root";     // sua senha MySQL
$db   = "barbearia"; // seu banco de dados

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

$conn->set_charset("utf8");
?>
