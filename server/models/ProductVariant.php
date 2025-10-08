<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

require_once __DIR__ . '/../utils/SkuGenerator.php';
require_once __DIR__ . '/ProductOption.php';

class ProductVariant
{
    private mysqli $db;
    private ProductOption $optionModel;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
        $this->optionModel = new ProductOption($db);
    }

    /**
     * Create variant with automatic SKU generation
     */
    public function create(string $productId, array $optionCombination, ?float $price = null, ?int $stock = null, ?string $imageUrl = null): ?array
    {
        // Generate unique SKU
        $sku = SkuGenerator::generateUniqueSku($this->db, $productId, $optionCombination);
        
        return $this->createWithSku($productId, $sku, $optionCombination, $price, $stock, $imageUrl);
    }

    /**
     * Create variant with specific SKU
     */
    public function createWithSku(string $productId, string $sku, array $optionCombination, ?float $price = null, ?int $stock = null, ?string $imageUrl = null): ?array
    {
        $stmt = $this->db->prepare('
            INSERT INTO product_variants (product_id, sku, option_combination, price, stock, image_url) 
            VALUES (?, ?, ?, ?, ?, ?)
        ');
        
        if (!$stmt) {
            error_log(json_encode('Prepare failed (variant create): ' . $this->db->error));
            return null;
        }

        $json = json_encode($optionCombination, JSON_UNESCAPED_UNICODE);
        $priceParam = $price !== null ? $price : null;
        $stockParam = $stock !== null ? $stock : null;
        $imageParam = $imageUrl !== null ? $imageUrl : null;

        $stmt->bind_param('sssdis', $productId, $sku, $json, $priceParam, $stockParam, $imageParam);
        if (!$stmt->execute()) {
            error_log('Execute failed (variant create): ' . $stmt->error);
            return null;
        }

        return $this->findById($stmt->insert_id);
    }

    /**
     * Generate variants automatically from product options
     */
    public function generateVariantsFromOptions(string $productId): array
    {
        // Get base product ID (handle linked products)
        $baseProductId = $this->getBaseProductId($productId);
        
        // Get all options for the base product
        $options = $this->optionModel->findByProductId($baseProductId);
        
        if (empty($options)) {
            return [];
        }
        
        // Group options by name
        $optionGroups = [];
        foreach ($options as $option) {
            $optionGroups[$option['name']][] = $option['value'];
        }
        
        // Generate cartesian product of all option combinations
        $combinations = $this->generateOptionCombinations($optionGroups);
        
        $variants = [];
        foreach ($combinations as $combination) {
            $variant = $this->create($productId, $combination);
            if ($variant) {
                $variants[] = $variant;
            }
        }
        
        return $variants;
    }

    /**
     * Get base product ID (handles linked product inheritance)
     */
    private function getBaseProductId(string $productId): string
    {
        // Check if this product has a linked_product_id in product_options
        $stmt = $this->db->prepare('
            SELECT DISTINCT linked_product_id 
            FROM product_options 
            WHERE product_id = ? AND linked_product_id IS NOT NULL 
            LIMIT 1
        ');
        
        if ($stmt) {
            $stmt->bind_param('s', $productId);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            
            if ($result && $result['linked_product_id']) {
                return $result['linked_product_id'];
            }
        }
        
        return $productId; // No linked product, use original
    }

    /**
     * Generate all possible combinations from option groups
     */
    private function generateOptionCombinations(array $optionGroups): array
    {
        if (empty($optionGroups)) {
            return [];
        }
        
        $combinations = [[]];
        
        foreach ($optionGroups as $optionName => $values) {
            $newCombinations = [];
            foreach ($combinations as $combination) {
                foreach ($values as $value) {
                    $newCombination = $combination;
                    $newCombination[] = ['name' => $optionName, 'value' => $value];
                    $newCombinations[] = $newCombination;
                }
            }
            $combinations = $newCombinations;
        }
        
        return $combinations;
    }

    public function findByProductId(string $productId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM product_variants WHERE product_id = ?');
        if (!$stmt) {
            return [];
        }
        $stmt->bind_param('s', $productId);
        $stmt->execute();
        $res = $stmt->get_result();
        $rows = $res->fetch_all(MYSQLI_ASSOC);
        return $rows;
    }

    /**
     * Get all variants for a product including linked product variants
     */
    public function getAllVariantsForProduct(string $productId): array
    {
        // Get base product ID (handle linked products)
        $baseProductId = $this->getBaseProductId($productId);
        
        // Get all products that link to this base product (including the base itself)
        $linkedProductIds = $this->getLinkedProductIds($baseProductId);
        $linkedProductIds[] = $baseProductId; // Include base product
        $linkedProductIds = array_unique($linkedProductIds);
        
        $allVariants = [];
        foreach ($linkedProductIds as $linkedId) {
            $variants = $this->findByProductId($linkedId);
            $allVariants = array_merge($allVariants, $variants);
        }
        
        return $allVariants;
    }

    /**
     * Get all product IDs that link to a base product
     */
    private function getLinkedProductIds(string $baseProductId): array
    {
        $stmt = $this->db->prepare('
            SELECT DISTINCT product_id 
            FROM product_options 
            WHERE linked_product_id = ?
        ');
        
        if (!$stmt) {
            return [];
        }
        
        $stmt->bind_param('s', $baseProductId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $productIds = [];
        while ($row = $result->fetch_assoc()) {
            $productIds[] = $row['product_id'];
        }
        
        return $productIds;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM product_variants WHERE id = ? LIMIT 1');
        if (!$stmt) {
            return null;
        }
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res = $stmt->get_result();
        return $res->fetch_assoc() ?: null;
    }

    public function findBySku(string $sku): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM product_variants WHERE sku = ? LIMIT 1');
        if (!$stmt) {
            return null;
        }
        $stmt->bind_param('s', $sku);
        $stmt->execute();
        $res = $stmt->get_result();
        return $res->fetch_assoc() ?: null;
    }

    public function findRelatedVariants(string $productId, string $productName): array
    {
        // Find variants from products with similar names (excluding current product)
        // This is a simplified approach - you might want to implement a more sophisticated
        // relationship system based on categories, brands, or explicit relationships
        
        // Extract base name (remove common variant suffixes like "Pro", "Max", "Mini", etc.)
        $baseName = $this->extractBaseName($productName);
        
        $stmt = $this->db->prepare('
            SELECT pv.* 
            FROM product_variants pv 
            JOIN products p ON pv.product_id = p.id 
            WHERE p.name LIKE ? 
            AND pv.product_id != ? 
            ORDER BY p.name, pv.sku
        ');
        
        if (!$stmt) {
            return [];
        }
        
        $searchPattern = '%' . $baseName . '%';
        $stmt->bind_param('ss', $searchPattern, $productId);
        $stmt->execute();
        $res = $stmt->get_result();
        return $res->fetch_all(MYSQLI_ASSOC);
    }

    private function extractBaseName(string $productName): string
    {
        // Remove common variant suffixes to find related products
        $suffixes = ['Pro', 'Max', 'Mini', 'Plus', 'Lite', 'Air', 'Ultra', 'SE'];
        $baseName = $productName;
        
        foreach ($suffixes as $suffix) {
            $baseName = preg_replace('/\s+' . preg_quote($suffix, '/') . '$/i', '', $baseName);
        }
        
        // Also try to extract brand + model (e.g., "iPhone 16" from "iPhone 16 Pro Max")
        if (preg_match('/^([A-Za-z]+\s+\d+)/', $baseName, $matches)) {
            return $matches[1];
        }
        
        return trim($baseName);
    }
}


