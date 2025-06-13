<?php
require 'db.php';
$db = get_db();

$room_id = $_GET['room_id'] ?? null;
if (!is_numeric($room_id)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid room_id"]);
    exit;
}

$stmt = $db->prepare("SELECT * FROM puzzles WHERE room_id = ? ORDER BY id ASC");
$stmt->execute([$room_id]);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
