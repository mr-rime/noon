<?php

require_once __DIR__ . '/../../models/Coupon.php';

class CouponResolver
{
    private $couponModel;

    public function __construct($db)
    {
        $this->couponModel = new Coupon($db);
    }

    public function getCoupons($root, $args)
    {
        $limit = $args['limit'] ?? 10;
        $offset = $args['offset'] ?? 0;
        $search = $args['search'] ?? '';

        $coupons = $this->couponModel->findAll($limit, $offset, $search);
        $total = $this->couponModel->getTotalCount($search);

        return [
            'success' => true,
            'message' => 'Coupons fetched successfully',
            'coupons' => $coupons,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset
        ];
    }

    public function getCoupon($root, $args)
    {
        $coupon = $this->couponModel->findById($args['id']);

        if (!$coupon) {
            return [
                'success' => false,
                'message' => 'Coupon not found',
                'coupon' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Coupon fetched successfully',
            'coupon' => $coupon
        ];
    }

    public function createCoupon($root, $args)
    {
        $coupon = $this->couponModel->create($args['input']);

        if (!$coupon) {
            return [
                'success' => false,
                'message' => 'Failed to create coupon',
                'coupon' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Coupon created successfully',
            'coupon' => $coupon
        ];
    }

    public function updateCoupon($root, $args)
    {
        $coupon = $this->couponModel->update($args['id'], $args['input']);

        if (!$coupon) {
            return [
                'success' => false,
                'message' => 'Failed to update coupon',
                'coupon' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Coupon updated successfully',
            'coupon' => $coupon
        ];
    }

    public function deleteCoupon($root, $args)
    {
        $success = $this->couponModel->delete($args['id']);

        if (!$success) {
            return [
                'success' => false,
                'message' => 'Failed to delete coupon'
            ];
        }

        return [
            'success' => true,
            'message' => 'Coupon deleted successfully'
        ];
    }

    public function validateCoupon($root, $args)
    {
        $code = $args['code'];
        $coupon = $this->couponModel->findByCode($code);

        if (!$coupon) {
            return [
                'success' => false,
                'message' => 'Invalid coupon code',
                'coupon' => null
            ];
        }

        if ($coupon['status'] !== 'active') {
            return [
                'success' => false,
                'message' => 'This coupon is not active',
                'coupon' => null
            ];
        }

        $now = new DateTime();
        $startsAt = new DateTime($coupon['starts_at']);
        if ($now < $startsAt) {
            return [
                'success' => false,
                'message' => 'This coupon is not yet valid',
                'coupon' => null
            ];
        }

        $endsAt = new DateTime($coupon['ends_at']);
        if ($now > $endsAt) {
            return [
                'success' => false,
                'message' => 'This coupon has expired',
                'coupon' => null
            ];
        }

        if ($coupon['usage_limit'] !== null && $coupon['used_count'] >= $coupon['usage_limit']) {
            return [
                'success' => false,
                'message' => 'This coupon has reached its usage limit',
                'coupon' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Coupon is valid',
            'coupon' => $coupon
        ];
    }
}
