
# AuraCommerce - Professional Setup Guide

This document explains how to take this code from the editor to a real, live business website.

## 📂 1. Saving Files Locally
To save this project to your computer:
1. Create a folder named `aura-shop`.
2. Recreate the folder structure:
   - `/components` (Put Navbar, Shop, Cart, etc. here)
   - `/services` (Put storage.ts and gemini.ts here)
3. Create the root files: `App.tsx`, `index.tsx`, `index.html`, `types.ts`, `constants.ts`.
4. Copy the code from the editor into these local files.

## 🚀 2. Going Live for Free (Vercel)
This is the "Real Use" method:
1. **GitHub**: Create a free account on GitHub and upload your files to a new repository.
2. **Vercel**: Go to [Vercel.com](https://vercel.com), connect your GitHub, and select this project.
3. **Automatic Hosting**: Vercel will give you a link like `your-store.vercel.app`. It's fast, secure, and free.

## 📊 3. Google Sheets (Order Storage)
1. Open a **Google Sheet**.
2. **Extensions > Apps Script**.
3. Paste the `doPost` script (found in the previous chat or the app code).
4. **Deploy > New Deployment > Web App**.
5. Set access to **"Anyone"**.
6. Copy the **Web App URL** into your Website's **Admin > Settings**.

## 🔐 4. Admin Dashboard
- **URL**: Your site URL + click the "Admin" button.
- **Default Password**: `admin` (Change this immediately in Settings!)

## 💰 5. GPay & Payments
- Enter your **UPI ID** (e.g., `yourname@okaxis`) in Admin Settings.
- The app automatically generates a QR code and a "Pay Now" button for mobile users.

## 📧 6. Email Notifications
- Use [EmailJS.com](https://emailjs.com) to get an email every time an order is placed.
- Enter your Service ID, Template ID, and Public Key in the Admin panel.
