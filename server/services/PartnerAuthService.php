<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

require_once __DIR__ . '/../utils/generateHash.php';
require_once __DIR__ . '/../models/Partner.php';

class PartnerAuthService
{
    private mysqli|null $db;

    public function __construct(mysqli|null $db)
    {
        $this->db = $db;
    }

    public function login(array $data): array
    {
        $emailValidator = v::stringType()->notEmpty()->length(1, 254);
        $passwordValidator = v::stringType()->notEmpty()->length(6, 255);

        try {
            $emailValidator->assert($data['business_email']);
            $passwordValidator->assert($data['password']);
        } catch (ValidationException $err) {
            return [
                'success' => false,
                'message' => 'Validation failed: ' . $err->getMessage(),
                'partner' => null,
            ];
        }

        $stmt = $this->db->prepare("SELECT * FROM partners WHERE business_email = ?");
        if (!$stmt) {
            return [
                'success' => false,
                'message' => 'Prepare failed: ' . $this->db->error,
                'partner' => null,
            ];
        }

        $stmt->bind_param("s", $data['business_email']);
        $stmt->execute();
        $result = $stmt->get_result();
        $partner = $result->fetch_assoc();

        if (!$partner || !password_verify($data['password'], $partner['password'])) {
            return [
                'success' => false,
                'message' => 'Invalid store name or password',
                'partner' => null,
            ];
        }

        $userSessionActive = session_status() === PHP_SESSION_ACTIVE;
        if ($userSessionActive) {
            session_write_close();
        }

        session_name('PARTNER_SESSION');
        if (isset($_COOKIE['PARTNER_SESSION'])) {
            session_id($_COOKIE['PARTNER_SESSION']);
        }
        session_start();
        session_regenerate_id(true);

        setcookie('PARTNER_SESSION', session_id(), [
            'expires' => time() + 86400 * 7,
            'path' => '/',
            'secure' => isset($_SERVER['HTTPS']),
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        session_write_close();

        if ($userSessionActive) {
            session_start();
        }

        return $partner;
    }

    public function register(array $data): array
    {
        $partnerModel = new Partner($this->db);

        $newPartner = $partnerModel->create([
            'store_name' => $data['store_name'],
            'business_email' => $data['business_email'],
            'business_phone' => $data['business_phone'] ?? null,
            'password' => $data['password'],
        ]);

        $userSessionActive = session_status() === PHP_SESSION_ACTIVE;
        if ($userSessionActive) {
            session_write_close();
        }

        session_name('PARTNER_SESSION');
        if (isset($_COOKIE['PARTNER_SESSION'])) {
            session_id($_COOKIE['PARTNER_SESSION']);
        }
        session_start();
        session_regenerate_id(true);


        setcookie('PARTNER_SESSION', session_id(), [
            'expires' => time() + 86400 * 7,
            'path' => '/',
            'secure' => isset($_SERVER['HTTPS']),
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        session_write_close();

        if ($userSessionActive) {
            session_start();
        }

        return $newPartner;
    }


    public function logout(): array
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_write_close();
            session_name('PARTNER_SESSION');
            session_start();
        }


        if (isset($_SESSION['partner'])) {
            unset($_SESSION['partner']);
            session_destroy();

            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie('PARTNER_SESSION_ID', '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
            }

            return [
                'success' => true,
                'message' => 'Logged out successfully',
                'partner' => null
            ];
        }

        return [
            'success' => false,
            'message' => 'No active partner session found',
            'partner' => null
        ];
    }
}
