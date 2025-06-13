<?php
require 'db.php';
$db = get_db();

$id = $_POST['id'] ?? null;
$password = $_POST['password'] ?? null;

if (!$id || !$password) {
    echo "0";
    exit;
}

$stmt = $db->prepare("SELECT password FROM rooms WHERE id = ?");
$stmt->execute([$id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    echo "0";
    exit;
}

// Временно ползвай директно сравнение (ако паролите в базата са plain text)
if ($row['password'] === $password) {
    echo "1";
} else {
    echo "▶ Очаквана парола в БД: " . $row['password'] . "\n";
    echo "▶ Подадена парола: " . $password . "\n";
    echo "0";
}
?>
