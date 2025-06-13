<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: text/plain');

require 'db.php';
$db = get_db();

try {
    $data = json_decode(file_get_contents("php://input"), true);
    $name_bg = $data['name_bg'] ?? '';
    $name_en = $data['name_en'] ?? '';
    $password = $data['password'] ?? '';
    $image_url = $data['image_url'] ?? '';

    $hashed = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $db->prepare("INSERT INTO rooms (name_bg, name_en, password, image_url) VALUES (?, ?, ?, ?) RETURNING id");
    $stmt->execute([$name_bg, $name_en, $hashed, $image_url]);

    header('Content-Type: application/json');
    echo json_encode(["id" => $stmt->fetchColumn()]);
} catch (Exception $e) {
    echo "⚠️ Грешка: " . $e->getMessage();
}
?>
