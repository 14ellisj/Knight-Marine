/* Use the same-site PHP handler on Knight Marine hosting. Local previews keep
   the email-app fallback so the form can still be tested without PHP. */
const isKnightMarineHosting = /(^|\.)knightmarine\.co\.uk$/i.test(window.location.hostname);

window.KM_ENQUIRY_CONFIG = {
  endpoint: isKnightMarineHosting ? "send-enquiry.php" : "",
};
