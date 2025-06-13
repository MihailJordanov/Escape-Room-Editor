<?php
require 'db.php';
$db = get_db();

header('Content-Type: application/json');

$stmt = $db->query("SELECT id, name_bg, name_en, image_url FROM rooms ORDER BY id ASC");
$rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rooms);
?>
