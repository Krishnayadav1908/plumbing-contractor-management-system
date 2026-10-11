# Plumbing Contractor Management System

A full-stack management system for plumbing contracting operations.

## Current module

Customer CRUD is the first vertical slice:

- `GET /api/customers?search=term`
- `GET /api/customers/:id`
- `POST /api/customers`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`

## Local setup

1. Create a MongoDB Atlas cluster and a database user.
2. In Atlas, add your current IP address under **Database Access > Network Access**. For Render later, add the Render outbound IPs or use the provider's documented network policy.
3. Copy `backend/.env.example` to `backend/.env` and replace the Atlas placeholders in `MONGO_URI`. Keep the URI out of git and do not expose it in frontend variables.
4. Set `JWT_SECRET` to a long random value.
5. Start the API with `cd backend && npm run dev`.
6. Start the frontend with `cd frontend && npm run dev`.

The API runs on `http://localhost:5000` and the frontend on `http://localhost:5173`.

## Realtime updates

The backend opens a MongoDB change stream for the `customers` collection and exposes it as server-sent events at `/api/customers/events`. The frontend subscribes to that endpoint and reloads the directory when a customer is created, updated, or deleted from any connected client.

MongoDB Atlas supports the required replica-set change streams. The backend must maintain a live connection to Atlas for realtime events to work.
