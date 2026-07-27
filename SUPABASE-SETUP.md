# Set up Knight Marine job stories

The website pages and staff editor are already built. This one-time setup gives them a secure login, a place to store stories and image uploads.

## Part 1 — Create the free project

1. Go to [supabase.com](https://supabase.com/) and create an account.
2. Choose **New project**. Name it `Knight Marine Website`, choose the region closest to the UK, and save the database password somewhere safe. The website will not need this password.
3. Wait for the project to finish preparing.

## Part 2 — Create the stories database

1. In the left-hand menu, open **SQL Editor** and choose **New query**.
2. Open [`supabase/schema.sql`](supabase/schema.sql), copy the whole file into the Supabase query box, then select **Run**.
3. You should see a success message. This creates the stories table, the secure image bucket and the permissions that protect publishing.

## Part 3 — Add the first Knight Marine staff publisher

1. In Supabase, open **Authentication** → **Users** → **Add user**.
2. Add the staff member’s email address and set a strong password. Keep this account for people trusted to publish stories.
3. Copy that user’s UUID from the Users screen.
4. Return to **SQL Editor**, create a new query, replace the placeholder below with the UUID, then run it:

   ```sql
   insert into public.admin_users (id) values ('PASTE-STAFF-USER-UUID-HERE');
   ```

Only users added in this way can upload images or publish stories. Additional staff can be added later by repeating these four steps.

## Part 4 — Connect the website

1. In Supabase, open **Project Settings** → **API**.
2. Copy the **Project URL** and the **Publishable key**. Do **not** use a `service_role` or secret key.
3. Open [`supabase-config.js`](supabase-config.js) in the website files and paste them here:

   ```js
   window.KM_SUPABASE_URL = "YOUR-PROJECT-URL";
   window.KM_SUPABASE_PUBLISHABLE_KEY = "YOUR-PUBLISHABLE-KEY";
   ```

4. Save the file and upload it with the rest of the website to GitHub.

The publishable key is expected to be visible in a website. The database rules in `schema.sql` are what prevent visitors from uploading or changing stories.

## Part 5 — Tell Supabase the live web address

Once GitHub Pages is live, open **Authentication** → **URL Configuration** in Supabase and set:

- **Site URL:** `https://knightmarine.co.uk`
- **Redirect URLs:** `https://knightmarine.co.uk/admin.html`

If you test on a GitHub Pages address before the custom domain is connected, temporarily add that address too.

## Using the system day to day

1. Visit `https://knightmarine.co.uk/admin.html`.
2. Sign in with the staff email and password.
3. Add a concise title, a short introduction, the main story and web-ready photographs.
4. Leave **Publish** unticked to save a private draft, or tick it to make the story visible immediately at `/stories.html`.

Images are limited to 6MB each to keep the public website quick. Resize large originals before upload and use clear landscape images where possible.

## Security notes

- The `/admin.html` page is deliberately excluded from Google.
- Stories remain private until the **Publish** box is ticked.
- Story images are public once uploaded because visitors must be able to view them. Do not upload images with private customer information, registration documents or personal contact details.
