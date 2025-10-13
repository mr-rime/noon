<?php

namespace App\Models;

use mysqli;

class Banner
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function create($name, $placement, $description, $targetUrl, $imageUrl, $startDate, $endDate, $isActive = true)
    {
        try {
            $id = $this->generateId();
            $query = "INSERT INTO banners (id, name, placement, description, target_url, image_url, start_date, end_date, is_active, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

            $stmt = $this->db->prepare($query);
            $stmt->bind_param('ssssssssi', $id, $name, $placement, $description, $targetUrl, $imageUrl, $startDate, $endDate, $isActive);

            if ($stmt->execute()) {
                $stmt->close();
                return $this->findById($id);
            }

            $stmt->close();
            return null;
        } catch (\Exception $e) {
            error_log("Error creating banner: " . $e->getMessage());
            return null;
        }
    }

    public function update($id, $name, $placement, $description, $targetUrl, $imageUrl, $startDate, $endDate, $isActive)
    {
        try {
            $query = "UPDATE banners 
                     SET name = ?,
                         placement = ?,
                         description = ?,
                         target_url = ?,
                         image_url = ?,
                         start_date = ?,
                         end_date = ?,
                         is_active = ?
                     WHERE id = ?";

            $stmt = $this->db->prepare($query);
            $stmt->bind_param('sssssssis', $name, $placement, $description, $targetUrl, $imageUrl, $startDate, $endDate, $isActive, $id);

            if ($stmt->execute()) {
                $stmt->close();
                return $this->findById($id);
            }

            $stmt->close();
            return null;
        } catch (\Exception $e) {
            error_log("Error updating banner: " . $e->getMessage());
            return null;
        }
    }

    public function delete($id)
    {
        try {
            $query = "DELETE FROM banners WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param('s', $id);

            $result = $stmt->execute();
            $stmt->close();
            return $result;
        } catch (\Exception $e) {
            error_log("Error deleting banner: " . $e->getMessage());
            return false;
        }
    }

    public function findById($id)
    {
        try {
            $query = "SELECT * FROM banners WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param('s', $id);
            $stmt->execute();

            $result = $stmt->get_result();
            $banner = $result->fetch_assoc();
            $stmt->close();

            if ($banner) {
                return $this->formatBanner($banner);
            }

            return null;
        } catch (\Exception $e) {
            error_log("Error finding banner: " . $e->getMessage());
            return null;
        }
    }

    public function findAll($placement = null, $isActive = null, $limit = 20, $offset = 0, $search = '')
    {
        try {
            $conditions = [];
            $params = [];
            $types = '';

            if ($placement !== null && $placement !== '') {
                $conditions[] = "placement = ?";
                $params[] = $placement;
                $types .= 's';
            }

            if ($isActive !== null) {
                $conditions[] = "is_active = ?";
                $params[] = $isActive;
                $types .= 'i';
            }

            if (!empty($search)) {
                $conditions[] = "(name LIKE ? OR description LIKE ?)";
                $searchParam = '%' . $search . '%';
                $params[] = $searchParam;
                $params[] = $searchParam;
                $types .= 'ss';
            }

            $whereClause = !empty($conditions) ? 'WHERE ' . implode(' AND ', $conditions) : '';

            $query = "SELECT * FROM banners 
                     $whereClause
                     ORDER BY created_at DESC 
                     LIMIT ? OFFSET ?";

            $params[] = (int) $limit;
            $params[] = (int) $offset;
            $types .= 'ii';

            $stmt = $this->db->prepare($query);
            if (!empty($params)) {
                $stmt->bind_param($types, ...$params);
            }

            $stmt->execute();
            $result = $stmt->get_result();
            $banners = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            return array_map([$this, 'formatBanner'], $banners);
        } catch (\Exception $e) {
            error_log("Error fetching banners: " . $e->getMessage());
            return [];
        }
    }

    public function getActiveBannersByPlacement($placement)
    {
        try {
            $currentDate = date('Y-m-d H:i:s');

            $query = "SELECT * FROM banners 
                     WHERE placement = ? 
                     AND is_active = 1 
                     AND start_date <= ? 
                     AND end_date >= ?
                     ORDER BY created_at DESC";

            $stmt = $this->db->prepare($query);
            $stmt->bind_param('sss', $placement, $currentDate, $currentDate);

            $stmt->execute();
            $result = $stmt->get_result();
            $banners = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();

            return array_map([$this, 'formatBanner'], $banners);
        } catch (\Exception $e) {
            error_log("Error fetching active banners: " . $e->getMessage());
            return [];
        }
    }

    public function getTotalCount($placement = null, $isActive = null, $search = '')
    {
        try {
            $conditions = [];
            $params = [];
            $types = '';

            if ($placement !== null && $placement !== '') {
                $conditions[] = "placement = ?";
                $params[] = $placement;
                $types .= 's';
            }

            if ($isActive !== null) {
                $conditions[] = "is_active = ?";
                $params[] = $isActive;
                $types .= 'i';
            }

            if (!empty($search)) {
                $conditions[] = "(name LIKE ? OR description LIKE ?)";
                $searchParam = '%' . $search . '%';
                $params[] = $searchParam;
                $params[] = $searchParam;
                $types .= 'ss';
            }

            $whereClause = !empty($conditions) ? 'WHERE ' . implode(' AND ', $conditions) : '';

            $query = "SELECT COUNT(*) as count FROM banners $whereClause";

            $stmt = $this->db->prepare($query);
            if (!empty($params)) {
                $stmt->bind_param($types, ...$params);
            }

            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();
            $stmt->close();

            return (int) $row['count'];
        } catch (\Exception $e) {
            error_log("Error getting banner count: " . $e->getMessage());
            return 0;
        }
    }

    public function toggleActive($id)
    {
        try {
            $query = "UPDATE banners SET is_active = NOT is_active WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param('s', $id);

            if ($stmt->execute()) {
                $stmt->close();
                return $this->findById($id);
            }

            $stmt->close();
            return null;
        } catch (\Exception $e) {
            error_log("Error toggling banner status: " . $e->getMessage());
            return null;
        }
    }

    private function formatBanner($banner)
    {
        return [
            'id' => $banner['id'],
            'name' => $banner['name'],
            'placement' => $banner['placement'],
            'description' => $banner['description'],
            'target_url' => $banner['target_url'],
            'image_url' => $banner['image_url'],
            'start_date' => $banner['start_date'],
            'end_date' => $banner['end_date'],
            'is_active' => (bool) $banner['is_active'],
            'created_at' => $banner['created_at'] ?? null
        ];
    }

    private function generateId()
    {
        return 'BNR' . str_pad(mt_rand(1, 999999999999999999), 18, '0', STR_PAD_LEFT);
    }
}
