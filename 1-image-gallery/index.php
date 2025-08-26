<?php
include 'config.php';

$limit = 6;
$page = isset($_GET['page']) ? $_GET['page'] : 1;
$start = ($page - 1) * $limit;

$result = $conn->query("SELECT * FROM images ORDER BY created_at DESC LIMIT $start, $limit");
$total = $conn->query("SELECT COUNT(*) as total FROM images")->fetch_assoc()['total'];
$pages = ceil($total / $limit);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Image Gallery</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen font-sans">

  <div class="max-w-7xl mx-auto py-10 px-6">
    <div class="mb-10">
      <h1 class="text-4xl font-bold text-center text-gray-800">🌟 Unique Image Gallery</h1>
      <form action="upload.php" method="POST" enctype="multipart/form-data" class="mt-8 bg-white shadow-lg rounded-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="title" required placeholder="Image Title" class="px-4 py-2 border rounded w-full">
          <input type="text" name="description" placeholder="Short Description" class="px-4 py-2 border rounded w-full">
          <input type="file" name="image" required class="w-full">
        </div>
        <button type="submit" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Upload</button>
      </form>
    </div>

    <!-- Gallery -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <?php while($row = $result->fetch_assoc()): ?>
        <div class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <img src="assets/uploads/<?= $row['filename'] ?>" class="w-full h-60 object-cover hover:scale-105 transition-transform duration-300">
          <div class="p-4">
            <h2 class="text-xl font-semibold text-gray-700"><?= htmlspecialchars($row['title']) ?></h2>
            <p class="text-gray-500"><?= htmlspecialchars($row['description']) ?></p>
            <p class="text-sm text-gray-400 mt-2"><?= date('d M Y', strtotime($row['created_at'])) ?></p>
          </div>
        </div>
      <?php endwhile; ?>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-10 space-x-2">
      <?php for($i = 1; $i <= $pages; $i++): ?>
        <a href="?page=<?= $i ?>" class="px-4 py-2 rounded border <?= $page == $i ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100' ?>">
          <?= $i ?>
        </a>
      <?php endfor; ?>
    </div>
  </div>

</body>
</html>
