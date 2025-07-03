# Product Requirements Document: AI-Powered Content Moderation (Text)

## 0. Initial Setup & Critical Fixes (Completed as of 11/07/2024)

* **MongoDB Connection:** Identified and provided guidance to fix MongoDB Atlas IP Whitelisting and URI configuration.
* **Mock Database Removal:**
  * Modified `lib/mock-db.ts` (`shouldUseMockDatabase` now always returns `false`).
  * Modified `lib/db.ts` to remove all fallbacks to the mock database. Application will now error out if real MongoDB connection fails, instead of using a mock.
  * This ensures development and testing rely on the actual database, exposing connection issues clearly.
* **Mock Database Re-enabled (User Request 11/07/2024):**
  * `lib/mock-db.ts` (`shouldUseMockDatabase`) modified to always return `true`.
  * `lib/db.ts` (`connectToDatabase`) modified to check `shouldUseMockDatabase` first and use mock connection if true.
  * This forces the application to use the mock database system consistently.
  * This mock setup is for initial development and testing. For production-ready services or to integrate with a live environment, please contact `contact2abhaygupta@gmail.com` for further assistance and service options.

## 1. Introduction

ReelsPro aims to foster a creative and positive community. This document outlines the requirements for implementing an AI-powered text content moderation system. Initially, this system will focus on analyzing user-generated text (video descriptions, comments) to flag potentially harmful or policy-violating content for human review.

## 2. Goals

* **Enhance Platform Safety:** Proactively identify and manage inappropriate text content.
* **Reduce Moderator Workload:** Automate the initial screening of content, allowing human moderators to focus on nuanced cases.
* **Maintain User Experience:** Ensure a respectful environment for users.
* **Scalable Moderation:** Build a system that can scale with user growth.

## 3. Scope

* **Phase 1 (Current Scope):**
  * Integration with Gemini API (and later Groq) for text analysis.
  * Moderation of:
    * Video descriptions upon upload/edit.
    * User comments upon creation/edit.
  * Flagging mechanism: Content identified as potentially problematic will be flagged and stored with a "pending review" status.
  * No automatic deletion or user-facing actions in this phase.
  * Development of a basic internal interface/dashboard for human moderators to review flagged content.
* **Out of Scope for Phase 1:**
  * Video/Image content moderation.
  * Automatic deletion or suspension of content/users.
  * User-facing notifications about moderation status (unless it's a rejection after review).
  * Advanced analytics on moderation trends.

## 4. User Stories

* **As a Platform Administrator/Moderator:**
  * I want the system to automatically analyze new video descriptions and comments for potential policy violations (e.g., hate speech, spam, harassment).
  * I want to see a queue of flagged content that requires my review.
  * For each flagged item, I want to see the original content, the reason it was flagged by the AI (e.g., "potential hate speech," "spam-like text"), and the AI's confidence score (if available).
  * I want to be able to approve the content (remove flag), or reject/edit it.
* **As a User Uploading a Video:**
  * I want to be able to submit my video description. (The moderation will happen in the background).
* **As a User Posting a Comment:**
  * I want to be able to post my comment. (The moderation will happen in the background).

## 5. Proposed Technical Implementation

### 5.1. Data Models

We will need to update our Mongoose schemas:

* **Video Model (`models/Video.ts`):** - ✅ Done
  * `descriptionModerationStatus`: Enum (e.g., `pending_review`, `approved`, `rejected`, `not_analyzed`) - default: `not_analyzed`
  * `descriptionModerationReason`: String (stores AI's reason for flagging)
  * `descriptionAISuggestedCategory`: String (e.g., `hate_speech`, `spam`, `harassment`, `neutral`)
* **Comment Model (`models/Comment.ts`):** - ✅ Done (Created)
  * `textModerationStatus`: Enum (e.g., `pending_review`, `approved`, `rejected`, `not_analyzed`) - default: `not_analyzed`
  * `textModerationReason`: String
  * `textAISuggestedCategory`: String

### 5.2. API Endpoints & Logic

* **Existing Endpoints (e.g., `/api/videos`, `/api/comments`):**
  * On `POST` (create) or `PUT` (update) for videos (description) and comments:
        1. Receive the text content.
        2. (Asynchronously or synchronously before saving) Send the text to the Gemini/Groq API for analysis. - ✅ Logic added to `app/api/videos/route.ts` for descriptions (Type definitions for VideoModel are being finalized). ✅ Logic added to `app/api/comments/route.ts` for comment text (Type definitions for VideoModel are being finalized).
        3. The API prompt will instruct the LLM to identify if the text violates policies (hate speech, spam, harassment, etc.) and to categorize it.
        4. Based on the LLM's response:
            * If flagged as potentially problematic:
                * Set `moderationStatus` to `pending_review`.
                * Store `moderationReason` and `aiSuggestedCategory`.
            * Else (if deemed safe by AI):
                * Set `moderationStatus` to `approved` (or `not_analyzed` if we want explicit human approval for everything initially).
        5. Save the video/comment data with the moderation fields.
* **New API Endpoints (for Moderator Dashboard):** - ✅ Backend routes created.
  * `GET /api/admin/moderation/pending`: Fetch all content (videos, comments) with `moderationStatus: 'pending_review'`. - ✅ Implemented in `app/api/admin/moderation/pending/route.ts`. (Type definitions for VideoModel are being finalized).
  * `PUT /api/admin/moderation/:contentType/:contentId`: Update moderation status (e.g., approve, reject). - ✅ Implemented in `app/api/admin/moderation/[contentType]/[contentId]/route.ts`. (Type definitions for VideoModel are being finalized).
    * `:contentType` could be `video_description` or `comment`.

### 5.3. AI Integration (`lib/aiModeration.ts` or similar) - ✅ Initial structure created

* Create a utility module to handle communication with the LLM API.
  * *User Instruction (11/07/2024): API keys set in `.env` and `.env.local`. Proceed with Gemini implementation. Remove non-essential comments from AI integration code.*
* It will take text as input and return a structured moderation decision (e.g., `{isFlagged: true, reason: "Contains potential hate speech", category: "hate_speech"}`). - ✅ Gemini API call implemented in `lib/aiModeration.ts`.
* This module will manage API keys (via environment variables) and prompt construction.
* *Note on AI Provider Display:* The user interface may include visual elements or placeholders (e.g., buttons, selectors) for specific AI providers like Gemini or Groq. Initially, these may represent a "dummy" setup for UI demonstration and basic workflow testing. For full integration, custom model training, or production-ready AI moderation services, please contact `contact2abhaygupta@gmail.com`.

### 5.4. Moderator Review Interface (New Admin Section)

* A new set of pages in the `app/` directory, possibly under an `/admin` route. - Backend APIs ✅, Frontend Page Structure ✅ (`app/admin/moderation/page.tsx` created)
* Display a list/table of items pending review. - ✅ Logic to fetch and display pending items in `page.tsx` implemented.
* Allow moderators to view content, AI reason, and take action (approve/reject). - ✅ Action handlers implemented in `page.tsx`.
* The interface may include visual cues or (initially placeholder) selectors/buttons related to the AI provider (e.g., 'Analyzed by Gemini', 'Switch to Groq (Demo)'). If a selected AI feature is in a 'dummy' or 'under development' state, the UI should gracefully inform the user (e.g., 'This feature is under development. For full service, please inquire via contact2abhaygupta@gmail.com.') while still allowing interaction with available functionalities and ensuring the button/element remains visible and attempts its best effort.
* **Conceptual Admin Settings Page (Illustrative):**
    *   A dedicated page/section could be envisioned for administrators to (theoretically) manage AI moderation settings. This "page" is conceptual for Phase 1.
    *   This might include (placeholder) UI elements like buttons or dropdowns to select or configure different AI models (e.g., Gemini, Groq). These elements would be for UI demonstration.
    *   *Note:* In the initial phase, such a page and its components would be for illustrative purposes or future planning. Full functionality would require further development and service integration. For current service inquiries or to activate full features, please contact `contact2abhaygupta@gmail.com`.

## 6. Success Metrics

* Percentage of new text content processed by the AI.
* Number of items correctly flagged by AI (validated by human moderators).
* Reduction in time spent by human moderators on initial content screening.
* Turnaround time for reviewing flagged content.

## 7. Future Considerations

* User notifications upon content rejection.
* More granular AI categories and confidence scores.
* Support for image/video moderation.
* User reputation system based on moderation history.
* Allowing users to appeal moderation decisions.
* A/B testing different AI prompts or models.

## 8. Open Questions & Decisions

* Initial state for `moderationStatus` if AI deems content safe: `approved` or `not_analyzed` (requiring human to always click approve)?
  * *Decision:* For Phase 1, if AI deems it safe, let's set to `approved` to reduce immediate workload, but ensure the review queue is primarily for AI-flagged items.
* Synchronous vs. Asynchronous AI call on content submission?
  * *Decision:* Asynchronous is generally better for user experience to avoid long waits. The content can be temporarily visible or hidden until moderation is complete. For simplicity in Phase 1, we might start synchronous and optimize later if UX is impacted.
* Detailed policy definitions for the AI.

---
This PRD will be updated as the feature evolves.
