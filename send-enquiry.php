<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, bool $ok, string $message): void
{
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Only POST requests are accepted.');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength < 1 || $contentLength > 30000) {
    respond(413, false, 'The enquiry is empty or too large.');
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    if ($originHost === '' || $originHost !== preg_replace('/:\d+$/', '', $host)) {
        respond(403, false, 'This enquiry could not be verified.');
    }
}

$payload = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($payload)) {
    respond(400, false, 'The enquiry could not be read.');
}

// A hidden field catches automated submissions without affecting real visitors.
if (trim((string) ($payload['website'] ?? '')) !== '') {
    respond(200, true, 'Thank you.');
}

$clean = static function ($value, int $maximum = 500): string {
    $value = trim(strip_tags((string) $value));
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    return function_exists('mb_substr')
        ? mb_substr($value, 0, $maximum)
        : substr($value, 0, $maximum);
};

$name = $clean($payload['name'] ?? '', 120);
$email = filter_var($clean($payload['email'] ?? '', 254), FILTER_VALIDATE_EMAIL);
$projectDescription = $clean($payload['projectDescription'] ?? '', 5000);

if ($name === '' || $email === false || $projectDescription === '') {
    respond(422, false, 'Please provide your name, a valid email address and project details.');
}

$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $secure,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();
$now = time();
if (isset($_SESSION['last_enquiry']) && $now - (int) $_SESSION['last_enquiry'] < 30) {
    respond(429, false, 'Please wait a moment before sending another enquiry.');
}

$fields = [
    'Name' => $name,
    'Email' => (string) $email,
    'Phone' => $clean($payload['phone'] ?? '', 60),
    'Preferred contact' => $clean($payload['preferredContact'] ?? '', 30),
    'Boat name' => $clean($payload['boatName'] ?? '', 120),
    'Boat make / model' => $clean($payload['boatModel'] ?? '', 160),
    'Boat length' => $clean($payload['boatLength'] ?? '', 40),
    'Marina / location' => $clean($payload['boatLocation'] ?? '', 160),
    'Work required' => $clean($payload['workType'] ?? '', 160),
    'Enquiry source' => $clean($payload['enquirySource'] ?? 'Knight Marine website', 200),
];

$lines = ['A new enquiry was sent through knightmarine.co.uk.', ''];
foreach ($fields as $label => $value) {
    if ($value !== '') {
        $lines[] = $label . ': ' . $value;
    }
}
$lines[] = '';
$lines[] = 'Project details:';
$lines[] = $projectDescription;
$lines[] = '';
$lines[] = 'Submitted: ' . gmdate('Y-m-d H:i:s') . ' UTC';

$workType = $fields['Work required'] !== '' ? $fields['Work required'] : 'Marine project';
$subject = 'Website enquiry - ' . preg_replace('/[\r\n]+/', ' ', $workType);
$replyTo = preg_replace('/[\r\n]+/', '', (string) $email);
$headers = [
    'From: Knight Marine Website <website@knightmarine.co.uk>',
    'Reply-To: ' . $replyTo,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . PHP_VERSION,
];

$sent = mail(
    'info@knightmarine.co.uk',
    $subject,
    wordwrap(implode("\r\n", $lines), 78),
    implode("\r\n", $headers)
);

if (!$sent) {
    respond(503, false, 'The message service is temporarily unavailable. Please call us instead.');
}

$_SESSION['last_enquiry'] = $now;
respond(200, true, 'Your project details have been sent.');

