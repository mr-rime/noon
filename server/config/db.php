<?php

class Database
{
    private $host;
    private $username;
    private $password;
    private $db_name;
    private $port;

    public $conn;

    public function __construct()
    {
        $this->host = getenv('DB_HOST') ?: '127.0.0.1';
        $this->username = getenv('DB_USER') ?: 'root';
        $this->password = getenv('DB_PASSWORD') ?: '51857';
        $this->db_name = getenv('DB_NAME') ?: 'noon_db';
        $this->port = getenv('DB_PORT') ?: 3307;
    }

    public function getConnection(): mysqli
    {
        $this->conn = new mysqli(
            $this->host,
            $this->username,
            $this->password,
            $this->db_name,
            $this->port
        );

        if ($this->conn->connect_error) {
            die(json_encode([
                "error" => "Connection failed: " . $this->conn->connect_error
            ]));
        }

        return $this->conn;
    }
}
