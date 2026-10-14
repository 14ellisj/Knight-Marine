# Knight Marine website

Static, multi-page website built from the supplied homepage direction and service copy.

## Main pages

- `index.html` - homepage
- `electronics.html` - electronics and navigation
- `marine-electrical.html` - marine electrical diagnostics, repairs and upgrades
- `power-systems.html` - Victron Energy and onboard power
- `calibration-commissioning.html` - instrument calibration, autopilot tuning and sea-trial commissioning
- `smart-boat.html` - connected power and navigation systems
- `boat-care.html` - maintenance overview
- `antifouling.html` - antifouling and hull care
- `detailing.html` - yacht detailing and polishing
- `yacht-refit.html` - refit support
- `fusion-audio.html` - Fusion marine audio
- `shop.html` - future shop landing page
- `stories.html` - public recent-work and job-stories page
- `story.html` - individual customer-facing job-story page
- `admin.html` - secure staff publishing area (connect Supabase first)
- `privacy-policy.html` - website privacy and cookie notice
- `terms-and-conditions.html` - website usage terms
- `send-enquiry.php` - same-site enquiry email handler for StackCP
- `.htaccess` - old WordPress redirects, HTTPS/canonical rules and security headers

## Media library

The live site uses only a small selection of supplied images in `assets/images/` so it remains fast. The original 5 GB photo library is deliberately not copied into the website.

Use `assets/media/gallery/README.md` for the gallery folder structure and web-image guidelines. Add selected, compressed images to the matching category as the gallery grows.

## Before publishing

1. Confirm the final telephone, email, company and address details.
2. Have the privacy notice and website terms reviewed and approved by the business.
3. Follow [DEPLOYMENT.md](DEPLOYMENT.md), including a real staging enquiry test.
4. Approve the Commercial holding page and add final Meet the Team photography.
5. Add an ecommerce platform and checkout when the shop catalogue is ready.
6. Follow [SUPABASE-SETUP.md](SUPABASE-SETUP.md) when staff story publishing is required.
