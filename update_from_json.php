<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");


require 'db.php';
$db = get_db();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['rooms'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

try {
    // Изчистваме съществуващите стаи и пъзели
    $db->exec("DELETE FROM puzzles");
    $db->exec("DELETE FROM rooms");

    foreach ($data['rooms'] as $room) {
        $stmt = $db->prepare("INSERT INTO rooms (id, name_bg, name_en, password, image_url) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $room['id'],
            $room['name_bg'] ?? $room['name'],
            $room['name_en'] ?? $room['nameEn'],
            $room['password'],
            $room['image_url'] ?? $room['image']
        ]);

        if (!empty($room['puzzles'])) {
            foreach ($room['puzzles'] as $puzzle) {
                $stmt = $db->prepare("INSERT INTO puzzles (room_id, type, text_bg, text_en, answer, solved)
                    VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $room['id'],
                    $puzzle['type'],
                    $puzzle['text']['bg'],
                    $puzzle['text']['en'],
                    is_array($puzzle['answer']) ? implode("-", $puzzle['answer']) : $puzzle['answer'],
                    filter_var($puzzle['solved'], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false'
                ]);
            }
        }
    }

    echo json_encode(["success" => true]);
}  catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage(),
        "trace" => $e->getTraceAsString()
    ]);
}

?>
