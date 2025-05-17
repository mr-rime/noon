<?php

class Database
{
    private $host = '127.0.0.1';
    private $username = 'root';
    private $db_name = 'noon_db';
    private $password = '51857';
    private $port = 3307;
    public $conn;

    public function getConnection(): mysqli
    {
        $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name, $this->port);

        if ($this->conn->connect_error) {
            die(json_encode([
                "error" => "Connection failed: " . $this->conn->connect_error
            ]));
        }

        return $this->conn;
    }

}