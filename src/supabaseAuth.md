# Unified Supabase Auth: Architecture Overview

The "Unified Supabase Auth" implementation moves the entire authentication responsibility to the Frontend, while the Backend focuses solely on verification. This is the industry-standard pattern for modern "Backend-as-a-Service" (BaaS) applications.

## 1. Where is it kept? (The Split)

*   **Frontend (The "Doer"):** Handles all **Sign Up**, **Login**, **Logout**, and **Google OAuth** actions. It interacts *directly* with Supabase.
*   **Backend (The "Verifier"):** Does **NOT** handle login/signup anymore. It only verifies the tokens sent by the frontend to ensure the user is who they say they are before returning sensitive data (like Visual Briefs).

## 2. Why did we do this?

*   **Security:** We stopped handling raw passwords on your backend. Supabase handles the encryption, storage, and secure transmission of credentials. Your backend now only sees secure, time-limited Access Tokens.
*   **Simplicity:** We deleted complex backend code for password hashing, JWT generation, and email verification. Supabase does this out-of-the-box for free.
*   **Consistency:** Previously, Google Login worked one way (frontend-first) and Email Login worked another (backend-first). Now, all login methods flow through the exact same path.
*   **Performance:** The frontend gets the session immediately from Supabase without waiting for your Python backend to wake up or process the request.

## 3. How it Works (The Flow)

Here is the step-by-step lifecycle of a user session in your new architecture:

### A. The Login / Signup (Frontend)

1.  **User Action:** User clicks "Login" or "Sign Up" in `Login.jsx` / `SignUp.jsx`.
2.  **Supabase Call:** The React app calls `supabase.auth.signInWithPassword(...)`.
3.  **Session Creation:** Supabase verifies credentials and returns a Session object containing:
    *   **Access Token (JWT):** The "Key" to your backend.
    *   **User Object:** Email, ID, Name.
4.  **Sync to Database:** In `AuthCallback.jsx` (for Google) and `SignUp.jsx`, we automatically sync this user data to your `public.users` table so your backend knows who they are.

### B. The API Request (Frontend -> Backend)

1.  **Preparation:** When the dashboard loads, `mockAPI.js` retrieves the Access Token from the current session.
2.  **Request:** It sends a request to your backend (e.g., `GET /api/briefs`) with the header: `Authorization: Bearer <Access Token>`

### C. The Verification (Backend)

1.  **Interception:** The request hits `app/utils/auth_dependency.py` before it reaches your route logic.
2.  **Validation:**
    *   The `get_current_user_id` function takes the token.
    *   It asks Supabase: *"Is this token valid?"*
    *   If **Yes:** It extracts the `user_id` and lets the request proceed.
    *   If **No:** It throws a `401 Unauthorized` error immediately.
3.  **Data Access:** The route (e.g., `briefs.py`) now knows the `user_id` is 100% valid and fetches only that user's data.

## Summary of Key Code Changes

| Component | Old Way (Refactored) | New Unified Way |
| :--- | :--- | :--- |
| **Login** | Frontend sent email/pass to Backend -> Backend hashed & checked DB. | Frontend calls `supabase.auth.signIn...`. Backend touched 0 times. |
| **Google Auth** | Frontend got code -> Sent to Backend -> Backend exchanged for token. | Frontend handles OAuth flow entirely. Backend just verifies the result. |
| **API Protection** | Backend checked a custom-made JWT secret. | Backend asks Supabase to verify the standard JWT. |
| **User Profile** | Created manually via SQL insert on signup. | Auto-synced from Auth provider (Google/Email) to DB on login. |
