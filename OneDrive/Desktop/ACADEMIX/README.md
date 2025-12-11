# Academix Batch Management Dashboard

This is a Next.js application for managing batches, designed for SHOs and Academic Leads.

## Features

- **Role-Based Access Control**: Login as SHO or Academic Lead.
- **Dashboard Overview**: View all batches with details (Strength, Course, School, Lead).
- **Create Batch**: SHOs can create new batches with auto-generated IDs.
- **Link Student**: SHOs can link students to batches.
- **Premium Design**: Dark mode UI with animations.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Supabase Setup**:
   - Create a Supabase project.
   - Create a table `batches` with columns:
     - `id` (text, primary key)
     - `name` (text)
     - `course` (text)
     - `strength` (numeric)
     - `start_date` (date)
     - `academic_lead` (text)
     - `sho_name` (text)
     - `school` (text)
   - Create a table `student_batches` with columns:
     - `id` (uuid, default gen_random_uuid())
     - `student_email` (text)
     - `batch_id` (text, foreign key to batches.id)
     - `linked_at` (timestamp)
   - Copy `.env.example` to `.env.local` and fill in your Supabase URL and Anon Key.

3. **Run Locally**:
   ```bash
   npm run dev
   ```

## Roles

- **SHO**: Can create batches and link students.
- **Academic Lead**: View-only access to dashboard.
