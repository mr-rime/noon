<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

require_once __DIR__ . "/../utils/generateHash.php";

class Order
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findAll(): array
    {
        $query = 'SELECT * FROM orders';
        $result = $this->db->query($query);

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function findById(int $id): ?array
    {
        $query = 'SELECT * FROM orders WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();



        return $result->fetch_assoc() ?: null;
    }

    public function create(array $data): ?array
    {
        $validator = v::key('currency', v::stringType()->notEmpty()->length(3, 4))
            ->key('shipping_address', v::stringType()->notEmpty())
            ->key('payment_method', v::stringType()->notEmpty())
            ->key('items', v::arrayType()->notEmpty());

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return null;
        }

        $userId = $_SESSION['user']['id'];
        $currency = $data['currency'];
        $shippingAddress = $data['shipping_address'];
        $paymentMethod = $data['payment_method'];
        $status = 'pending';
        $paymentStatus = 'unpaid';



        $this->db->begin_transaction();

        try {
            $orderQuery = "INSERT INTO orders (id, user_id, total_amount, currency, status, shipping_address, payment_method, payment_status) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            $stmt = $this->db->prepare($orderQuery);
            $orderId = generateHash();
            $totalAmount = 0;

            $totalAmount = 0;

            foreach ($data['items'] as $item) {
                $productId = $item['product_id'];
                $inputPrice = $item['price'];

                $productStmt = $this->db->prepare("SELECT price FROM products WHERE id = ?");
                $productStmt->bind_param("s", $productId);
                $productStmt->execute();
                $productStmt->bind_result($dbPrice);
                $productStmt->fetch();
                $productStmt->close();

                if ((float) $dbPrice != (float) $inputPrice) {
                    throw new Exception(
                        "Price mismatch for product $productId: " .
                        "DB says $dbPrice, input says $inputPrice"
                    );
                }

                $totalAmount += (float) $dbPrice * $item['quantity'];
            }

            $final_amount = round($totalAmount, 2);


            $stmt->bind_param("sidsssss", $orderId, $userId, $final_amount, $currency, $status, $shippingAddress, $paymentMethod, $paymentStatus);

            $stmt->execute();

            $stmt->close();

            $itemID = generateHash();

            $itemQuery = "INSERT INTO order_items (id, order_id, product_id, quantity, price, currency) VALUES (?, ?, ?, ?, ?, ?)";
            $itemStmt = $this->db->prepare($itemQuery);

            foreach ($data['items'] as $item) {
                $productId = $item['product_id'];
                $quantity = $item['quantity'];
                $price = $item['price'];
                $itemCurrency = $item['currency'];

                $itemStmt->bind_param("sssids", $itemID, $orderId, $productId, $quantity, $price, $itemCurrency);
                $itemStmt->execute();
            }


            $itemStmt->close();

            $this->db->commit();


            return [
                'id' => $orderId,
                'user_id' => $userId,
                'total_amount' => $final_amount,
                'currency' => $currency,
                'status' => $status,
                'shipping_address' => $shippingAddress,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentStatus,
                'items' => $data['items'],
            ];
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Order creation failed: " . $e->getMessage());
            return null;
        }
    }


    private function createTracking(int $orderId): bool
    {
        $trackingNumber = $this->generateTrackingNumber();

        $query = "INSERT INTO order_tracking (order_id, tracking_number, status) VALUES (?, ?, 'processing')";
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Tracking insert prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param("is", $orderId, $trackingNumber);
        $result = $stmt->execute();
        $stmt->close();

        return $result;
    }

    private function generateTrackingNumber(): string
    {
        return strtoupper(bin2hex(random_bytes(5)));
    }

    public function update(int $id, array $data): bool
    {
        $validator = v::key('status', v::stringType()->oneOf(
            v::equals('pending'),
            v::equals('processing'),
            v::equals('shipped'),
            v::equals('delivered'),
            v::equals('cancelled')
        ))
            ->key('payment_status', v::stringType()->oneOf(
                v::equals('unpaid'),
                v::equals('paid'),
                v::equals('refunded')
            ));

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return false;
        }

        $this->db->begin_transaction();

        try {
            $query = 'UPDATE orders SET status = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            $stmt = $this->db->prepare($query);

            if (!$stmt) {
                error_log("Prepare failed: " . $this->db->error);
                $this->db->rollback();
                return false;
            }

            $stmt->bind_param('ssi', $data['status'], $data['payment_status'], $id);
            $stmt->execute();
            $stmt->close();

            if ($data['payment_status'] === 'paid') {
                $this->createTracking($id);
            }

            $this->db->commit();
            return true;

        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Order update failed: " . $e->getMessage());
            return false;
        }
    }

    public function delete(int $id): bool
    {
        $query = 'DELETE FROM orders WHERE id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('i', $id);

        return $stmt->execute();
    }
}
