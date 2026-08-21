# Gravequit API Contract & Data Model

This document serves as the shared contract between Frontend (Dev A), Backend (Dev B), and Database (Dev C).

> [!NOTE]
> Authentication is handled externally (e.g., via Supabase Auth). The backend expects a valid Bearer token (JWT) in the `Authorization` header for all protected routes to identify the `user_id`. Signup and login endpoints are not part of this API contract.

## Data Model (Core Tables)

- **users**: `id`, `email`, `created_at`
- **items**: `id`, `user_id`, `title`, `category` (course / habit / skill / other), `status` (active / quit / completed), `started_at`, `ended_at`
- **quit_reasons**: `id`, `item_id`, `reason_tag` (enum: too_busy / too_hard / lost_interest / no_deadline / other), `reason_text` (nullable), `voice_transcript` (nullable), `created_at`
- **pattern_summaries**: `id`, `user_id`, `computed_stats` (JSON), `ai_summary_text`, `generated_at` (cached, regenerated on new quit event)

---

## API Endpoints

### 1. List Items
**GET** `/items`
- **Auth Required:** Yes
- **Purpose:** List all items for the currently authenticated user.
- **Response:**
```json
[
  {
    "id": 14,
    "title": "DSA course",
    "category": "course",
    "status": "active",
    "started_at": "2026-08-20T10:00:00Z",
    "ended_at": null
  },
  {
    "id": 12,
    "title": "30-day running streak",
    "category": "habit",
    "status": "quit",
    "started_at": "2026-08-01T10:00:00Z",
    "ended_at": "2026-08-10T10:00:00Z"
  }
]
```

### 2. Create Item
**POST** `/items`
- **Auth Required:** Yes
- **Purpose:** Create a new item for the current user. Status defaults to `active`.
- **Request Body:**
```json
{
  "title": "DSA course",
  "category": "course"
}
```
- **Response:**
```json
{
  "id": 14,
  "title": "DSA course",
  "category": "course",
  "status": "active",
  "started_at": "2026-08-20T10:00:00Z"
}
```

### 3. Mark Item as Quit
**PATCH** `/items/{id}/quit`
- **Auth Required:** Yes
- **Purpose:** Mark an active item as quit and attach the reason.
- **Request Body:**
```json
{
  "reason_tag": "too_busy",
  "reason_text": "exams took over",
  "voice_transcript": null
}
```
- **Response:**
```json
{
  "id": 14,
  "status": "quit",
  "ended_at": "2026-08-21T09:00:00Z"
}
```

### 4. Get Pattern Summary
**GET** `/patterns/summary`
- **Auth Required:** Yes
- **Purpose:** Return the computed stats and the natural-language AI pattern summary. Cached in `pattern_summaries`.
- **Response:**
```json
{
  "stats": {
    "avg_days_to_quit": 9.3,
    "most_common_tag": "too_busy",
    "total_quit": 4,
    "total_completed": 1
  },
  "ai_summary": "You've dropped 4 of your last 5 courses within about a week and a half, most often citing being too busy — and it tends to cluster right after exam periods.",
  "generated_at": "2026-08-21T09:05:00Z"
}
```

### 5. Transcribe Voice (Stretch Goal)
**POST** `/voice/transcribe`
- **Auth Required:** Yes
- **Purpose:** Upload an audio file, return the transcribed text (using Web Speech API or Whisper).
- **Request Body:** `multipart/form-data` with `file` field containing the audio blob.
- **Response:**
```json
{
  "transcript": "I just got too busy with my midterm exams."
}
```
