<?php
header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';

function respond($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $search = trim($_GET['search'] ?? '');

    $sql = "SELECT * FROM tasks";
    $params = [];

    if ($search !== '') {
        $sql .= " WHERE title LIKE :search";
        $params['search'] = '%' . $search . '%';
    }

    $sql .= " ORDER BY is_done ASC, created_at DESC";

    $statement = $pdo->prepare($sql);
    $statement->execute($params);

    respond($statement->fetchAll());
}

$input = json_decode(file_get_contents('php://input'), true);

if (!is_array($input)) {
    respond(['error' => 'Ongeldige invoer.'], 400);
}

if ($method === 'POST') {
    $title = trim($input['title'] ?? '');
    $priority = $input['priority'] ?? 'normal';
    $dueDate = $input['due_date'] ?? null;

    if ($title === '' || strlen($title) > 150) {
        respond(['error' => 'Vul een titel in van maximaal 150 tekens.'], 400);
    }

    if (!in_array($priority, ['low', 'normal', 'high'], true)) {
        respond(['error' => 'Ongeldige prioriteit.'], 400);
    }

    $statement = $pdo->prepare(
        "INSERT INTO tasks (title, priority, due_date)
         VALUES (:title, :priority, :due_date)"
    );

    $statement->execute([
        'title' => $title,
        'priority' => $priority,
        'due_date' => $dueDate ?: null
    ]);

    respond(['message' => 'Taak toegevoegd!', 'id' => $pdo->lastInsertId()], 201);
}

if ($method === 'PATCH') {
    $id = (int)($input['id'] ?? 0);

    if ($id <= 0) {
        respond(['error' => 'Ongeldig taaknummer.'], 400);
    }

    if (isset($input['is_done'])) {
        $statement = $pdo->prepare(
            "UPDATE tasks SET is_done = :is_done WHERE id = :id"
        );

        $statement->execute([
            'is_done' => $input['is_done'] ? 1 : 0,
            'id' => $id
        ]);

        respond(['message' => 'Taakstatus aangepast.']);
    }

    $title = trim($input['title'] ?? '');
    $priority = $input['priority'] ?? 'normal';
    $dueDate = $input['due_date'] ?? null;

    if ($title === '' || strlen($title) > 150) {
        respond(['error' => 'Vul een titel in van maximaal 150 tekens.'], 400);
    }

    if (!in_array($priority, ['low', 'normal', 'high'], true)) {
        respond(['error' => 'Ongeldige prioriteit.'], 400);
    }

    $statement = $pdo->prepare(
        "UPDATE tasks
         SET title = :title, priority = :priority, due_date = :due_date
         WHERE id = :id"
    );

    $statement->execute([
        'title' => $title,
        'priority' => $priority,
        'due_date' => $dueDate ?: null,
        'id' => $id
    ]);

    respond(['message' => 'Taak aangepast.']);
}

if ($method === 'DELETE') {
    $id = (int)($input['id'] ?? 0);

    if ($id <= 0) {
        respond(['error' => 'Ongeldig taaknummer.'], 400);
    }

    $statement = $pdo->prepare("DELETE FROM tasks WHERE id = :id");
    $statement->execute(['id' => $id]);

    respond(['message' => 'Taak verwijderd.']);
}

respond(['error' => 'Deze actie bestaat niet.'], 405);
