<?php
use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

require_once __DIR__ . '/../utils/generateHash.php';

class Partner
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function create(array $data): ?array
    {
        $validator = v::key('store_name', v::stringType()->notEmpty()->length(1, 100))
            ->key('business_email', v::stringType()->notEmpty()->length(1, 254))
            ->key('password', v::stringType()->notEmpty()->length(1, 255));

        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            return [
                'error' => true,
                'message' => 'Validation failed: ' . $err->getMessage()
            ];
        }

        $query = "SELECT id FROM partners WHERE store_name = ?";
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            return [
                'error' => true,
                'message' => "Prepare failed: " . $this->db->error
            ];
        }

        $stmt->bind_param('s', $data['store_name']);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            return [
                'error' => true,
                'message' => 'Store name is already taken.'
            ];
        }

        $hashedPassword = password_hash($data["password"], PASSWORD_DEFAULT);
        $query = 'INSERT INTO partners (id, user_id, store_name, business_email, business_phone, password) VALUES (?, ?, ?, ?, ?, ?)';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            return [
                'error' => true,
                'message' => "Prepare failed: " . $this->db->error
            ];
        }

        $hash = generateHash();
        $stmt->bind_param(
            'sissss',
            $hash,
            $_SESSION['user']['id'],
            $data['store_name'],
            $data['business_email'],
            $data['business_phone'],
            $hashedPassword
        );

        if ($stmt->execute()) {
            return $this->findById($hash);
        } else {
            return [
                'error' => true,
                'message' => "Execute failed: " . $stmt->error
            ];
        }
    }


    public function find(): array
    {
        $query = "SELECT id, user_id, store_name, business_email, business_phone FROM partners";
        $result = $this->db->query($query);

        if (!$result) {
            error_log("Query failed: " . $this->db->error);
            return [];
        }

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function findById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT id, user_id, store_name, business_email, business_phone, created_at, status, updated_at FROM partners WHERE id = ?");

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [
                'error' => true,
                'message' => 'Partner not found.'
            ];
        }

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param("s", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result && $result->num_rows > 0 ? $result->fetch_assoc() : null;
    }

    public function update(string $id, array $data): bool
    {
        $fields = [];
        $params = [];
        $types = '';

        if (isset($data['store_name'])) {
            $fields[] = "store_name = ?";
            $params[] = $data['store_name'];
            $types .= 's';
        }

        if (isset($data['business_email'])) {
            $fields[] = "business_email = ?";
            $params[] = $data['business_email'];
            $types .= 's';
        }

        if (isset($data['business_phone'])) {
            $fields[] = "business_phone = ?";
            $params[] = $data['business_phone'];
            $types .= 's';
        }

        if (isset($data['password'])) {
            $fields[] = "password = ?";
            $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
            $types .= 's';
        }

        if (empty($fields))
            return false;

        $query = "UPDATE partners SET " . implode(", ", $fields) . " WHERE id = ?";
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $types .= 's';
        $params[] = $id;

        $stmt->bind_param($types, ...$params);

        return $stmt->execute();
    }
}
?>