# Pizza Dot — Food Ordering Website + Owner Dashboard

A multi-page static website built using HTML, CSS, JavaScript modules, Firebase Authentication, Firebase Realtime Database, and FormSubmit. Designed for GitHub Pages and Firebase Spark (free) plan. No npm, Cloud Functions, Cloud Storage, paid payment gateway, or hosting build required.

## IMPORTANT — before accepting real orders

This ZIP contains the **full site code and an operational Firebase integration**, but it is **not connected to a real Firebase project**. No real account, email recipient confirmation, or payment transaction can be verified until you configure the services described below and complete the launch checklist. Do not publish as a payment-accepting site without testing.

- Easypaisa number **12345678910** is the number supplied for this project. **Confirm that it is a real account belonging to the restaurant**. Replace `CONFIRM ACCOUNT HOLDER` with the exact recipient name. The current website warns customers to verify the details.
- FormSubmit email destination: `areebahmed200801@gmail.com`. This address must activate FormSubmit on first use and must be controlled by the restaurant owner.
- The service areas `Nazimabad`, `Liaquatabad`, and `FC Area` are provisional; confirm actual delivery radius and delivery fee.
- Sample menu prices were transcribed from screenshots and may be outdated. The screenshots contained both an **11.11 two-large deal for Rs. 1,111** and another two-large bundle for Rs. 1,200. Both are included; disable the outdated offer from Admin > Menu before launching.
- Reviews were paraphrased from screenshots; verify rights/consent before making public commercial claims.

## 1. What's included

| Page | URL path | Capability |
| --- | --- | --- |
| Customer homepage | `/` | Hero, categories, offers, menu, product detail modal, search/filter, cart, reviews |
| Customer authentication | `/account/` | Sign up, sign in, email verification, password reset, sign out |
| Checkout | `/checkout/` | Delivery form, manual Easypaisa payment details, screenshot upload, live-price validation, order creation, FormSubmit notification |
| My Orders | `/orders/` | Live status, history, preparation countdown, missing screenshot retry |
| Owner sign in | `/admin/` | Firebase email/password sign in with UID role check |
| Owner dashboard | `/admin/dashboard/` | Stats, all orders, payment verification, proof view, status/prep timer, menu manager, sales chart |
| Privacy | `/privacy/` | Draft information disclosure (owner review required) |

## 2. Set up Firebase on the FREE Spark plan

1. Open https://console.firebase.google.com/ and create a project (choose **Spark**, not Blaze).
2. In **Build > Authentication > Sign-in method**, enable **Email/Password**. Phone sign-in is not used.
3. In **Build > Realtime Database**, create a database, choosing your nearby available region. Choose **Locked mode**, then install the security rules in step 5. You **do not** need Firestore or Cloud Storage.
4. In **Project settings > General > Your apps**, register a **Web app**, and copy its Firebase configuration object. In `assets/js/firebase-config.js`, replace the placeholders for `apiKey`, `authDomain`, `databaseURL`, `projectId`, and `appId`. The `databaseURL` must be exactly the value displayed by the Firebase Realtime Database console. Do not use a Firestore endpoint. Do not publish any Firebase service-account private keys.
5. In **Realtime Database > Rules**, paste all content from `firebase/database.rules.json` (the JSON file contains a `rules` property), then **Publish**. Don't leave the database in test mode or set global `.read` or `.write` to `true`.
6. Populate the menu: easiest method is to go to Realtime Database **Data > Import JSON** and upload `firebase/initial-database.json`. **WARNING:** importing to the database root can overwrite existing data. Only do this on a fresh/empty database. Alternatively, do not import; once the admin account is authorized, use **Admin > Menu Manager > Load starter menu** on an empty products collection.
7. In **Authentication > Settings > Authorized domains**, add the hostname that serves your site, for example `areebdevelops.github.io` or your custom domain. Make sure `localhost` is allowed if you want local testing.

### Give YOUR account admin privileges (no public admin registration)

1. In Firebase **Authentication > Users**, use **Add user** to create an email/password owner account. Do not use a shared/simple password. Copy this user's long **UID** from the Users list. This is **not** the email address.
2. In Realtime Database **Data**, create the top-level child `admins`, and inside it a child named exactly that UID, with the **boolean** value `true` (not the string `'true'`). The result must look like:

   ```json
   {
     "admins": {
       "YOUR_REAL_AUTH_UID": true
     }
   }
   ```

   **Important:** This is only an illustration of the `admins` node. Do not overwrite your existing `products` collection to add this. Use the Firebase Console's **Add child** action. Web users cannot assign themselves an admin UID because `admins` has `.write: false`.
3. Visit `/admin/` on your deployed site and sign in. Only allowlisted admin UIDs will pass the database security check; ordinary users are redirected or signed out.
4. There are **no hardcoded owner credentials** and **no hidden dashboard preview link on the public customer login screen**.

### Database structure

```text
/products/{productId}                  -> public menu; admin writes only
/admins/{uid}                          -> boolean true set only using Firebase Console
/users/{uid}                           -> user's own signup profile
/orders/{uid}/{orderId}                -> private orders; owner reads all
/receipts/{uid}/{orderId}              -> compressed JPG data URL; private to buyer/admin
```

Customers can create orders only once under their own UID, with verified email and price-snapshot validation against the published menu. They cannot set their payment as verified, edit existing orders, change other users' data, alter menu prices, or become admins. Admins alone can change payment and order statuses. The free static-hosting model cannot prevent users from downloading HTML/JS; **database authorization is enforced by Firebase server-side rules**, not by hidden frontend code.

### Important checkout limitations

This project charges **Rs. 0 delivery fee** because no actual restaurant delivery tariff was provided. The published security rules enforce exactly zero. To set a nonzero delivery fee, the merchant must update BOTH `businessConfig.deliveryFee` in `assets/js/firebase-config.js` and the `deliveryFee` `.validate` constraint in `firebase/database.rules.json`, then republish the rules. The frontend must never be your only price authority. For more advanced delivery pricing, a trusted backend or a Firebase database price configuration would be recommended.

Easypaisa is a **manual payment** process. A submitted screenshot or transaction reference does not prove money arrived. Admin staff MUST verify the actual transaction in the real merchant Easypaisa app before clicking **Verify & confirm**. The admin dashboard recomputes order totals from price snapshots validated at order creation and blocks approval if the quoted total differs, but there is no payment-gateway confirmation and no automatic refund.

## 3. Screenshots — free and access-controlled, no Storage service

Firebase **Cloud Storage requires Blaze**; do not enable it for this project. Instead:

- The checkout converts JPG/PNG/WEBP screenshots into a compressed JPEG client-side (normally under ~230 KB of image bytes, ~310,000 characters including base64).
- A proof is saved under `/receipts/{uid}/{orderId}` in Realtime Database, with rules allowing **only that order's customer and authorized admins** to read it. Public image URLs are never created.
- The owner loads the screenshot only after selecting **View payment screenshot** in the protected dashboard.
- The database quota is limited. Regularly monitor database usage and consider scheduled/manual deletion of old receipts. There is no automatic cleanup on the Spark-only static setup.
- If an order saves but its screenshot upload fails, the customer can open `/orders/` and use **Upload payment proof**. The order remains pending until an authorized admin verifies the payment.

## 4. FormSubmit email notification (free)

1. The notification destination is configured in `assets/js/firebase-config.js` as `businessConfig.notificationEmail`.
2. The checkout saves the order and its screenshot **first**, then submits a structured email notification using the documented FormSubmit AJAX endpoint.
3. On initial use, FormSubmit sends an email asking the destination mailbox to **activate** the form. Open and approve the activation link in that inbox. Check spam/junk as needed.
4. Later successful orders should email the order ID, customer name, phone number, delivery address, line items, total amount, and transaction reference. The email contains a **link to the secure owner dashboard** where the proof can be inspected.
5. The screenshot is **not attached to the FormSubmit email**. FormSubmit documents multipart native form uploads but does not document reliable AJAX multipart attachments; this architecture keeps the screenshot privately inside Firebase and sends the rest by email. This is safer than a public file-hosting URL, and it avoids Cloud Storage. If FormSubmit fails, the Firebase dashboard is still the source of truth.
6. Gmail and FormSubmit can rate-limit or filter messages; email delivery is best-effort, not a transaction guarantee. Use Firebase dashboard orders as the authoritative notification channel.

FormSubmit documentation: https://formsubmit.co/documentation

## 5. Deploy on GitHub Pages (no build step)

1. Extract this ZIP into a local folder; retain the folder structure (all `index.html` files).
2. Edit `assets/js/firebase-config.js` with your Firebase web app values and exact Easypaisa account information.
3. In GitHub, create a **public repository**, e.g. `pizza-dot`, then upload the **contents** of this folder to its repository root (not the containing folder).
4. GitHub repository > **Settings > Pages** > Build and deployment > **Deploy from a branch** > select `main` and `/ (root)` > Save.
5. Your website URL will have this pattern: `https://YOUR-USERNAME.github.io/pizza-dot/`. Pages use real folders (for example, `/pizza-dot/admin/dashboard/`); no redirects, server rewrites or GitHub Actions are required.
6. Add `YOUR-USERNAME.github.io` to Firebase Authentication's **Authorized domains**. For custom domains, also authorize the custom hostname.
7. Use a local web server to preview rather than opening HTML as `file://`. Example in this directory: `python -m http.server 8000` then browse `http://localhost:8000/`.
8. Test account registration, verification, checkout, screenshot upload, received order, admin access, payment approval, preparation timer, customer tracking and email activation before announcing the website.

If you use the repository website as a project subpath, this website automatically resolves links and images relative to its own `shared.js` module, so `pizza-dot` can be renamed without breaking most paths. The `robots.txt` file is only advisory; authenticated data is protected by Firebase rules instead.

## 6. Order status workflow

```text
Customer checkout -> pending_payment (Payment: pending)
Admin checks actual Easypaisa transfer and receipt -> paymentStatus: verified -> confirmed
Admin sets preparation time -> preparing, prepStartedAt: Firebase server timestamp
Admin updates -> ready -> out_for_delivery -> delivered
Admin can reject payment -> paymentStatus: rejected -> cancelled
```

The customer uses a real-time order listener. The preparation timer uses the `.info/serverTimeOffset` value so countdowns are based on Firebase's approximate server clock rather than just the customer's device time. Status changes are persisted in the Realtime Database, and page refreshes preserve the current state.

## 7. Free Spark-plan usage considerations

At the time of the project, Firebase Realtime Database Spark includes **1 GB stored, 10 GB/month downloaded, and up to 100 simultaneous connections** (verify current quotas on Firebase pricing). Firebase Email/Password Authentication is included, subject to Firebase safeguards and quotas. Use sensible screenshot retention, avoid loading proof images in bulk, and monitor Firebase usage.

Firebase pricing: https://firebase.google.com/pricing
Firebase Storage plan requirement: https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024

No paid Cloud Functions, Storage buckets or paid gateway are required in this solution. However, a static browser-only app is not equivalent to an independently audited commerce backend: it cannot implement trustworthy automated payment reconciliation, shipping fee calculations, guaranteed email delivery, server-side anti-fraud checks, or rate-limited checkout. Review security rules with Firebase Rules Playground and perform real authenticated tests before using in production.

## 8. Launch checklist

- [ ] Paste your exact Firebase web config and test the Realtime Database URL.
- [ ] Turn on Email/Password in Firebase Authentication.
- [ ] Publish `firebase/database.rules.json`; keep root access denied.
- [ ] Import sample menu or initialize it via the authorized admin panel.
- [ ] Create a strong-password admin account and allowlist its UID under `admins`.
- [ ] Activate FormSubmit from the recipient inbox and send a test order.
- [ ] Replace/confirm the Easypaisa number and holder name (no mock payment details live).
- [ ] Confirm true product prices, promotion dates, inventory and delivery availability.
- [ ] Test a normal user cannot see any other user's order or admin data.
- [ ] Test real payment proof, manual verification, status updates and timer on two devices.
- [ ] Check how refunds, order cancellations and customer complaints will be handled.
- [ ] Update `privacy/` with actual business contacts and retention rules.
- [ ] Consider Firebase App Check / abuse controls if public ordering volume grows.

## Customizing product images and data

All supplied local food images are in `assets/images/`, mostly cropped from the provided Pizza Dot Instagram screenshots. They are compressed WEBP files. Replace them with your original high-resolution product photos when available. To add a new image, add the file to `assets/images/` before publishing your GitHub update, then set the exact `assets/images/<filename>.webp` path in **Admin > Menu Manager**. External image URLs intentionally fall back to a local image for safety. The page design uses the provided colors and menu categories; sample descriptions and product combinations can be edited live in the admin dashboard.

## Technical structure

```text
index.html
account/index.html
checkout/index.html
orders/index.html
admin/index.html
admin/dashboard/index.html
privacy/index.html
assets/css/style.css
assets/js/firebase-config.js        <-- your only configuration file
assets/js/shared.js                 <-- Firebase setup & common helpers
assets/js/app.js                    <-- homepage, catalog, cart
assets/js/account.js                <-- authentication
assets/js/checkout.js               <-- secure manual checkout & notifications
assets/js/orders.js                 <-- user order history & tracker
assets/js/admin-login.js            <-- owner authentication
assets/js/admin-dashboard.js        <-- orders, payments, stats and menu management
assets/js/catalog-data.json         <-- sample menu used by admin seeding
assets/images/                     <-- compressed local media
firebase/database.rules.json        <-- PUBLISH to Firebase Realtime Database Rules
firebase/initial-database.json      <-- optional data import for empty database
```

**Do not publish a Firebase service account JSON anywhere within this project.** Standard browser Firebase web configuration is safe to include as long as server-side database rules are correctly deployed.
