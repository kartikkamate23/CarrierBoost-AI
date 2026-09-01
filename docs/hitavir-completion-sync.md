# Hitavir completion sync

CareerBoost never lets a learner mark a Hitavir course complete. Completion is accepted only from
Hitavir Tech through a signed server-to-server event.

## Configuration

1. Apply `supabase/migrations/20260824193000_hitavir_course_progress.sql`.
2. Set the same strong random `HITAVIR_WEBHOOK_SECRET` in Hitavir and CareerBoost.
3. Configure Hitavir to send `POST /api/hitavir-completion` when progress changes.
4. The learner must sign in to CareerBoost with the same email used on Hitavir.

## Request

Sign the exact raw JSON body with HMAC-SHA256 and send the lowercase hexadecimal digest in
`x-hitavir-signature` (either the digest alone or prefixed with `sha256=`).

```json
{
  "eventId": "hitavir-event-123",
  "learnerEmail": "learner@example.com",
  "courseSlug": "learn-like-a-top-performer",
  "status": "completed",
  "progressPercent": 100,
  "completedAt": "2026-08-24T14:30:00.000Z"
}
```

The endpoint rejects unknown courses, invalid emails, invalid signatures, and client-originated
updates. Replayed events are idempotent, and row-level security exposes progress only to the
authenticated learner whose email matches the event.
