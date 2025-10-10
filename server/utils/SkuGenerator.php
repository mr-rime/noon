<?php

class SkuGenerator
{
    /**
     * Generate SKU using pattern: [PRODUCT_ID]-[SHORT_OPTION_VALUES]-[RANDOM_4]
     * Example: IP16PRO-BLK-256G-A7F3
     */
    public static function generateSku(string $productId, array $optionCombination): string
    {

        $shortProductId = strtoupper(preg_replace('/[^A-Z0-9]/', '', substr($productId, 0, 8)));


        $shortOptions = [];
        foreach ($optionCombination as $option) {
            $shortValue = self::shortenOptionValue($option['value']);
            if ($shortValue) {
                $shortOptions[] = $shortValue;
            }
        }


        $randomSuffix = self::generateRandomSuffix();


        $parts = array_filter([$shortProductId, implode('-', $shortOptions), $randomSuffix]);

        return implode('-', $parts);
    }

    /**
     * Shorten option values to 3-4 characters
     */
    private static function shortenOptionValue(string $value): string
    {
        $value = strtoupper(trim($value));


        $abbreviations = [
            'BLACK' => 'BLK',
            'WHITE' => 'WHT',
            'SILVER' => 'SLV',
            'GOLD' => 'GLD',
            'BLUE' => 'BLU',
            'GREEN' => 'GRN',
            'RED' => 'RED',
            'YELLOW' => 'YLW',
            'PURPLE' => 'PUR',
            'PINK' => 'PNK',
            'ORANGE' => 'ORG',
            'GRAY' => 'GRY',
            'GREY' => 'GRY',
            'SMALL' => 'S',
            'MEDIUM' => 'M',
            'LARGE' => 'L',
            'EXTRA LARGE' => 'XL',
            'XXL' => 'XXL',
            'XXXL' => 'XXXL',
        ];


        if (isset($abbreviations[$value])) {
            return $abbreviations[$value];
        }


        if (preg_match('/(\d+)\s*(GB|TB|MB)/i', $value, $matches)) {
            $size = $matches[1];
            $unit = strtoupper($matches[2]);
            return $size . substr($unit, 0, 1);
        }


        if (is_numeric($value) && strlen($value) <= 4) {
            return $value;
        }


        $cleaned = preg_replace('/[^A-Z0-9]/', '', $value);
        return substr($cleaned, 0, 4);
    }

    /**
     * Generate random 4-character alphanumeric suffix
     */
    private static function generateRandomSuffix(): string
    {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $result = '';
        for ($i = 0; $i < 4; $i++) {
            $result .= $chars[random_int(0, strlen($chars) - 1)];
        }
        return $result;
    }

    /**
     * Validate SKU format
     */
    public static function isValidSku(string $sku): bool
    {

        return preg_match('/^[A-Z0-9\-]{8,30}$/', $sku) === 1;
    }

    /**
     * Extract product ID from SKU (first part before first hyphen)
     */
    public static function extractProductIdFromSku(string $sku): string
    {
        $parts = explode('-', $sku);
        return $parts[0] ?? '';
    }

    /**
     * Check if SKU already exists in database
     */
    public static function isSkuUnique(mysqli $db, string $sku): bool
    {
        $stmt = $db->prepare('SELECT COUNT(*) as count FROM product_variants WHERE sku = ?');
        if (!$stmt) {
            return false;
        }

        $stmt->bind_param('s', $sku);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();

        return ($result['count'] ?? 1) === 0;
    }

    /**
     * Generate unique SKU (retry if collision)
     */
    public static function generateUniqueSku(mysqli $db, string $productId, array $optionCombination, int $maxRetries = 10): string
    {
        for ($i = 0; $i < $maxRetries; $i++) {
            $sku = self::generateSku($productId, $optionCombination);
            if (self::isSkuUnique($db, $sku)) {
                return $sku;
            }
        }


        $timestamp = substr(time(), -4);
        $baseSku = self::generateSku($productId, $optionCombination);
        return substr($baseSku, 0, -4) . $timestamp;
    }
}
