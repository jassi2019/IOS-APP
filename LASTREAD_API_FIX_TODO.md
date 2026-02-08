# Last Read API Fix - TODO

## Problem

POST request to `/api/v1/lastreads` failing with 500 error and "Validation error" message.

## Root Cause

Backend controller tries to delete last read by `userId` AND `topicId`, but the `userId` field has a `unique` constraint (only one last read per user). When user reads a different topic, the delete doesn't remove the existing record, causing a unique constraint violation.

## Tasks

### Backend Fixes

- [x] Fix `backend-main/src/controllers/lastread/create.js` - Change delete query to use only `userId`
- [x] Add validation for `topicId` parameter
- [x] Improve error handling

### Frontend Improvements

- [x] Add validation in `src/hooks/api/topics.ts` to ensure `topicId` is valid

### Testing

- [ ] Test navigating between different topics
- [ ] Verify last read updates correctly
- [ ] Confirm no more 500 errors in logs

## Progress

- [x] Identified root cause
- [x] Created fix plan
- [x] Fixed backend controller to delete by userId only
- [x] Added topicId validation in backend
- [x] Added better error handling for database errors
- [x] Added frontend validation for topicId
- [ ] Testing required - restart backend server and test the app

## Changes Made

### Backend (`backend-main/src/controllers/lastread/create.js`)

1. Changed `LastRead.destroy({ where: { userId, topicId } })` to `LastRead.destroy({ where: { userId } })`
   - This ensures all previous last read records for the user are deleted before creating a new one
2. Added validation to check if `topicId` is provided
3. Added specific error handling for:
   - `SequelizeUniqueConstraintError` - Returns 400 with clear message
   - `SequelizeForeignKeyConstraintError` - Returns 400 when invalid topicId is provided

### Frontend (`src/hooks/api/topics.ts`)

1. Added validation in `markTopicAsLastRead` function to ensure:
   - `topicId` is not null/undefined
   - `topicId` is a string
   - `topicId` is not an empty string
2. Returns rejected promise with clear error message if validation fails

## How to Test

1. Restart the backend server to apply the controller changes
2. Open the mobile app
3. Navigate to Home screen
4. Click on a topic to start reading
5. Go back and click on a different topic
6. Verify no 500 errors appear in the console
7. Check that the "Continue Reading" section updates to show the latest topic
