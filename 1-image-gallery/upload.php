<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $desc = $_POST['description'];
    $file = $_FILES['image'];

    $targetDir = "assets/uploads/";
    $fileName = time() . '_' . basename($file["name"]);
    $targetFilePath = $targetDir . $fileName;

    $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
    $allowedTypes = ['jpg', 'png', 'jpeg', 'gif', 'webp'];

    if (in_array($fileType, $allowedTypes)) {
        if (move_uploaded_file($file["tmp_name"], $targetFilePath)) {
            $stmt = $conn->prepare("INSERT INTO images (title, description, filename) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $title, $desc, $fileName);
            $stmt->execute();
            header("Location: index.php?upload=success");
        } else {
            echo "Failed to upload file.";
        }
    } else {
        echo "Invalid file type.";
    }
}
?>
