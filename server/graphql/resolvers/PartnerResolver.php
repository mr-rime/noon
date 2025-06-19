<?php

require_once __DIR__ . "/../../services/PartnerAuthService.php";

function createPartner(mysqli $db, array $data)
{
    $partnerModel = new PartnerAuthService($db);

    $partner = $partnerModel->register($data);

    if (isset($partner['error']) && $partner['error'] === true) {
        return [
            'success' => false,
            'message' => $partner['message']
        ];
    }

    return [
        'success' => true,
        'message' => 'Partner created successfully.',
        'partner' => $partner
    ];
}

function loginPartner(mysqli $db, array $data)
{
    $partnerModel = new PartnerAuthService($db);
    $partner = $partnerModel->login($data);

    return [
        'success' => true,
        'message' => 'Login successful',
        'partner' => $partner
    ];
}


function getPartner(mysqli $db, array $data)
{
    $partnerModel = new Partner($db);

    $partner = $partnerModel->findById($data['id']);

    if ($partner === null || (isset($partner['error']) && $partner['error'] === true)) {
        return [
            'success' => false,
            'message' => $partner['message'] ?? 'Partner not found.'
        ];
    }

    return [
        'success' => true,
        'message' => 'Partner received successfully.',
        'partner' => $partner
    ];
}

?>