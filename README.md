# RelayLoop - Hospital Readmission Prediction

A production-ready, enterprise-grade frontend for hospital readmission prediction using React (JavaScript) + Vite + TailwindCSS v4.

## Features

- Secure role-based authentication (Admin, Doctor, Nurse)
- Strict access control per user role
- Integration with ML backend (gRPC + REST fallback)
- Optimized performance (Vite + lazy-loading + caching)
- Responsive design with WCAG AA accessibility
- Free-tier deployment (Vercel + Render + Supabase)
- Clean, modular component-based code

## Tech Stack

- **Frontend**: React (JavaScript) + Vite + TailwindCSS v4
- **Auth**: Supabase Auth (JWT tokens, RLS policies)
- **API**: gRPC-Web client, Axios REST fallback with schema validation
- **Forms**: react-hook-form + zod validation
- **State/Data**: React Query (caching, optimistic updates)
- **Testing**: Vitest + React Testing Library + MSW
