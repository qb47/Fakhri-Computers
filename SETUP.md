# Fakhri Computers — Setup Guide

This guide connects the website to **Supabase** (your database) and **Netlify** (your website host).

It takes about 15 minutes. Follow the steps in order. You only need a web browser.

What you will end up with:

- A live database that stores your laptops, leads and reservations.
- An admin login that lets you manage the shop from the dashboard.
- A public website that shows your real catalogue instead of the sample one.

---

## Part 1 — Create a Supabase project

1. Go to **https://supabase.com** and sign up or log in.
2. Click **New project**.
3. Give it a name, for example `fakhri-computers`.
4. **Region:** choose one close to the UAE. Good choices are **Bahrain (me-south-1)** or a nearby European region. A closer region means a faster website for your customers.
5. Set a **database password** and save it somewhere safe. You will not need it for this guide, but keep it.
6. Click **Create new project** and wait a minute or two while it builds.

---

## Part 2 — Run the database schema

This creates all the tables and security rules the website needs.

1. In your Supabase project, open **SQL Editor** in the left menu.
2. Click **New query**.
3. Open the file **`supabase/schema.sql`** in this project, select all of it, and copy it.
4. Paste it into the SQL Editor.
5. Click **Run** (bottom-right).

**It is safe to run this file twice** — it is written so that running it again does not break anything or duplicate your data. If you are ever unsure whether it ran, just run it again.

When it finishes you will see a **Success** message. You should now have these tables (visible under **Table Editor**): `admins`, `machines`, `leads`, `bulk_enquiries`, `reservations`, `contact_messages`, `settings`.

---

## Part 3 — Create your admin user

Your login is a Supabase **user**. Creating the user and making them an admin are **two separate steps** — do not skip the second one.

### 3a. Create the user

1. Open **Authentication** → **Users**.
2. Click **Add user** → **Create new user**.
3. Enter the **email** and **password** you want to log in with.
4. **Tick "Auto Confirm User"** so the account works immediately without a confirmation email.
5. Click **Create user**.

### 3b. Make that user an admin

**Creating a user does NOT make them an admin.** Admin rights come from a row in the `public.admins` table, and only you (through the SQL Editor) can add it.

The last statement in `schema.sql` does this, but it uses a placeholder email. You must put **your** email in and run it.

1. Open **SQL Editor** → **New query**.
2. Paste this, replacing the email with the **same email you used in step 3a**:

   ```sql
   insert into public.admins (user_id, email)
   select id, email from auth.users where email = 'your-email@example.com'
   on conflict (user_id) do nothing;
   ```

3. Click **Run**.

That single statement promotes whichever account matches that email. If you use a different email later, change it and re-run just this statement.

---

## Part 4 — Get your Project URL and anon key

1. Open **Settings** (the gear icon) → **API**.
2. Copy two values:
   - **Project URL** — looks like `https://xxxxxxxx.supabase.co`
   - **anon / public** key — a long string starting with `eyJ...` (this is also called the **public** key)

> ⚠️ **NEVER put the `service_role` key in the frontend.**
>
> The API page also shows a `service_role` / secret key. That key bypasses all security. If it ever ends up in the website code, in Netlify, or in a file that gets shared, **anyone** can read and delete all your customer data.
>
> Use **only** the **anon / public** key in this project. The anon key is safe to ship in the browser — see the note in Part 9.

---

## Part 5 — Local development (running the site on your computer)

1. In the project root folder, create a file named **`.env`** (if it does not already exist).
2. Put exactly these two lines in it, replacing the values with the ones you copied in Part 4:

   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   The names must be **exactly** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — the app reads those precise names and will ignore anything else.

3. Save the file and restart the dev server so it picks up the new values.

**Note:** `.env` is **git-ignored** (see `.gitignore`), so it stays on your machine and is never committed or uploaded. Never paste your keys into a file that *is* committed to the project.

---

## Part 6 — Netlify (your live website)

The live site needs the same two values, set on Netlify.

1. Log in to **https://app.netlify.com** and open your site.
2. Go to **Site configuration** → **Environment variables**.
3. Click **Add a variable** and add the same two, with the same names and values:

   | Key | Value |
   | --- | --- |
   | `VITE_SUPABASE_URL` | your Project URL |
   | `VITE_SUPABASE_ANON_KEY` | your anon / public key |

4. **Trigger a redeploy** so the new values are built into the site: go to **Deploys** → **Trigger deploy** → **Deploy site**.

The values are baked in at build time, so **changing them only takes effect after a new deploy**.

---

## Part 7 — How to check it worked

1. Open the site and log in to the admin dashboard with the email and password from Part 3.
2. The red **"Demo mode"** banner should be **gone**. (For reference, it reads: *"Demo mode. Supabase is not connected..."* — if you still see it, go to Part 8.)
3. In the dashboard, **add a machine**. Open the **public laptops page** in another tab — your new machine should appear there.
4. Fill in the **quiz form** on the public site. In the dashboard, open the **Leads** section — your test submission should appear there.

If all four work, you are live.

---

## Part 8 — Troubleshooting

### "Demo mode" banner won't go away

The app did not find the environment variables.

- Check the variable **names** are spelled exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Locally: make sure `.env` is in the project root, then **restart the dev server**.
- On Netlify: make sure the variables are saved **and that you triggered a redeploy**. Values set after a build are not picked up until the site is rebuilt.

### "That account is not an administrator."

You signed in successfully, but your email is not in the `public.admins` table.

- Re-do **Part 3b**: run the `insert into public.admins ...` statement with your exact login email.
- Creating the user alone is not enough — the admin row is what grants access.

### "Couldn't reach the database."

The URL or key is wrong.

- Re-copy the **Project URL** and **anon / public** key from **Settings → API** (Part 4) and update them locally **and** on Netlify.
- Make sure you did not copy the key only partially, and that there are no extra spaces or quotes around the values.

---

## Part 9 — A note on data safety

The **anon key is public by design**. It is meant to be visible in the browser — that is why it is called the "public" key.

What actually protects your data is **row-level security (RLS)**, which `schema.sql` turns on for every table:

- The public site may **read published listings and settings**, and may **create** form entries (quiz leads, bulk enquiries, contact messages).
- **Only a signed-in admin** may read customer personal data or change anything.
- The `admins` table can only be written to from the SQL Editor (by you), never from the browser.

So even though anyone can see the anon key, they cannot read your customer list or edit your shop. The one thing that would break this is putting the **`service_role` key** in the frontend — never do that (see the warning in Part 4).
