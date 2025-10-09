<?php
function app_log($message, $data = null)
{
    $logDir = __DIR__ . '/logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0777, true);
    }

    $logFile = $logDir . '/app.log';
    $time = date('Y-m-d H:i:s');

    $entry = "[$time] " . $message;
    if ($data !== null) {
        $entry .= " | " . json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
    $entry .= PHP_EOL;

    file_put_contents($logFile, $entry, FILE_APPEND);
}
