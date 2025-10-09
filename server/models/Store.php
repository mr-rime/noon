<?php

class Store
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function create(array $data): ?array
    {
        // Unique email check
        $stmt = $this->db->prepare('SELECT id FROM stores WHERE email = ? LIMIT 1');
        $stmt->bind_param('s', $data['email']);
        $stmt->execute();
        if ($stmt->get_result()->fetch_assoc()) {
            return null;
        }

        $hashed = password_hash($data['password'], PASSWORD_BCRYPT);

        $stmt = $this->db->prepare('INSERT INTO stores (name, number, email, password, thumbnail_url) VALUES (?, ?, ?, ?, ?)');
        if (!$stmt)
            return null;
        $number = $data['number'] ?? null;
        $thumb = $data['thumbnail_url'] ?? null;
        $stmt->bind_param('sssss', $data['name'], $number, $data['email'], $hashed, $thumb);
        if (!$stmt->execute())
            return null;
        return $this->findById($stmt->insert_id);
    }

    public function update(array $data): ?array
    {
        $fields = [];
        $types = '';
        $values = [];

        foreach (['name', 'number', 'email', 'thumbnail_url'] as $col) {
            if (isset($data[$col])) {
                $fields[] = "$col = ?";
                $types .= 's';
                $values[] = $data[$col];
            }
        }
        if (isset($data['password']) && $data['password'] !== '') {
            $fields[] = 'password = ?';
            $types .= 's';
            $values[] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
        if (!$fields)
            return $this->findById((int) $data['id']);

        $types .= 'i';
        $values[] = (int) $data['id'];

        $sql = 'UPDATE stores SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        if (!$stmt)
            return null;

        $stmt->bind_param($types, ...$values);
        if (!$stmt->execute())
            return null;
        return $this->findById((int) $data['id']);
    }

    public function delete(int $id): bool
    {
        // Nullify store_id in products first
        $stmt = $this->db->prepare('UPDATE products SET store_id = NULL WHERE store_id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();

        $stmt = $this->db->prepare('DELETE FROM stores WHERE id = ?');
        if (!$stmt)
            return false;
        $stmt->bind_param('i', $id);
        return $stmt->execute() && $stmt->affected_rows > 0;
    }

    public function findAll(): array
    {
        $res = $this->db->query('SELECT * FROM stores ORDER BY id DESC');
        $stores = $res ? $res->fetch_all(MYSQLI_ASSOC) : [];
        foreach ($stores as &$s) {
            $s['products'] = $this->findProducts((int) $s['id']);
            unset($s['password']);
        }
        return $stores;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM stores WHERE id = ? LIMIT 1');
        if (!$stmt)
            return null;
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if (!$row)
            return null;
        $row['products'] = $this->findProducts((int) $row['id']);
        unset($row['password']);
        return $row;
    }

    private function findProducts(int $storeId): array
    {
        $stmt = $this->db->prepare('SELECT id, name, price, currency FROM products WHERE store_id = ?');
        $stmt->bind_param('i', $storeId);
        $stmt->execute();
        $res = $stmt->get_result();
        return $res->fetch_all(MYSQLI_ASSOC);
    }
}


