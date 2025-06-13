<?php
function get_db() {
    $host = 'localhost';
    $port = '5432';
    $dbname = 'escape_room';
    $user = 'misho';
    $password = '1234'; // смени с твоята реална парола

    try {
        return new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
    } catch (PDOException $e) {
        die("Database connection failed: " . $e->getMessage());
    }
}
?>
