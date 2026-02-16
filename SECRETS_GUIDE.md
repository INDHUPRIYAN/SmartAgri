# Secrets & Environment Variables Guide

This project has been configured to use environment variables for sensitive information (API keys, etc.) to keep them out of GitHub.

## Backend

1.  Navigate to the `backend` folder.
2.  Copy `.env.example` to `.env`.
    ```bash
    cp .env.example .env
    ```
3.  Fill in the values in `.env`.
4.  **Note**: `firebase_key.txt` and `temp.wav` are ignored by git but should be present locally for the app to work.

## Frontend

1.  Navigate to the `frontend` folder.
2.  Copy `.env.example` to `.env`.
    ```bash
    cp .env.example .env
    ```
3.  The `.env` file should contain your Firebase configuration keys starting with `EXPO_PUBLIC_`.
4.  Expo will automatically load these variables.

## Important

*   **NEVER** commit `.env` files to GitHub.
*   **NEVER** commit `firebase_key.txt` to GitHub.
*   If you add new secrets, add them to `.env` and update `.env.example` (with empty values) so other developers know what keys are needed.
