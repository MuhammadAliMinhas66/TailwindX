Tailwind Components Hub — MERN + Auth0

A custom-built Tailwind Component Library Platform developed using the MERN stack.
This application allows a single admin (authenticated through Auth0 using my Gmail) to upload, manage, and organize reusable React + Tailwind UI components.
Users can browse, view live previews, copy component code, and read setup instructions.

Project Overview

Admin-only login using Auth0

Secure dashboard to upload React + Tailwind components

Public catalog where users can:

View the rendered preview of each component

Copy the JSX/Tailwind code

Read installation and usage instructions

Clean, responsive UI inspired by modern component libraries

No live editing — only preview and code display

Features

Private admin panel protected with Auth0

Component uploading with title, category, code, and documentation fields

Live rendered preview of React components

Syntax-highlighted code blocks

One-click code copy functionality

Organized components by categories

Fully responsive frontend

MERN architecture with clean separation between client and server

Tech Stack

Frontend

React

Tailwind CSS

Axios

React Router

Backend

Node.js

Express.js

MongoDB with Mongoose

Authentication

Auth0 (restricted to a single admin account)

Use Cases

A personal library of reusable React + Tailwind components

A self-hosted alternative to sites like ReactBits, TailwindUI, or ShadCN

A documentation-style platform for showcasing custom UI components

Project Structure (Simplified)
client/
  src/
    components/
    pages/
    utils/
server/
  routes/
  controllers/
  models/
  middleware/

Purpose

This project serves as a personal, self-managed Tailwind UI component hub where I can upload custom components and share them in a structured, easy-to-browse format. The public-facing interface allows developers to preview components and integrate them into their projects quickly.

License

MIT License
