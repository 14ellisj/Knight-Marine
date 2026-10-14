# StackCP deployment guide

This repository contains a static website plus one PHP enquiry handler. It does
not need WordPress.

## Create the clean upload ZIP

After committing the release, run this from the repository folder:

```sh
git archive --format=zip --output=knight-marine-upload.zip HEAD
```

The `.gitattributes` rules keep documentation, macOS files and outstanding
asset notes out of the upload package.

## Test on staging first

1. In StackCP, create Files and Databases backups and download the completed
   backup before its 12-hour expiry.
2. Take a Timeline Backup snapshot as a second recovery point.
3. Open File Manager and enter `staging_html`.
4. Preserve the existing WordPress staging files, then clear the document root.
5. Upload `knight-marine-upload.zip` and extract it directly into
   `staging_html`. `index.html` and `.htaccess` must be at the top level.
6. Visit `https://staging.knightmarine.co.uk` and complete the checks below.

Do not use StackCP's WordPress **Clone into Live** button for this site.

## Staging checks

- Homepage and every main navigation link load over HTTPS.
- Desktop and mobile menus work.
- Both project videos play with sound and controls.
- A real test enquiry arrives at `info@knightmarine.co.uk`; reply-to uses the
  visitor's address. Also confirm spam filtering does not quarantine it.
- Telephone, email and map links work.
- Privacy, website terms and the custom 404 page load.
- Old WordPress addresses redirect to the correct new pages.
- Commercial-page wording and the Meet the Team photography are approved.
- Stories show the intended empty state until Supabase is configured.

## Live switch

1. Take and download a fresh full backup immediately before launch.
2. Replace—not overlay—the WordPress files in `public_html` with the contents of
   the tested ZIP. Keeping old WordPress PHP files alongside the static site can
   load the wrong homepage and leaves unnecessary software exposed.
3. Do not alter DNS, mailboxes or email settings.
4. Test the live domain, enquiry delivery, redirects, videos and 404 response.
5. Purge the StackCP edge cache after the checks pass.

Keep the previous WordPress database and downloaded backup until the new site
has been accepted and has run successfully for an agreed recovery period.

