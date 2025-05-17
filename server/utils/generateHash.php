<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Hidehalo\Nanoid\Client;

function generateHash()
{
    $client = new Client();
    $id = $client->generateId();

    return $id;
}