# Tailwind Components Hub — MERN + Auth0

A custom-built Tailwind Component Library Platform developed using the MERN stack. This application provides a private admin dashboard (secured via Auth0 using my Gmail) where I can upload and manage React + Tailwind UI components. Users can browse components, view live previews, copy the code, and read installation and usage instructions.

## Overview

This project includes:

- **Admin-only authentication** using Auth0
- A **secure dashboard** for uploading React + Tailwind components
- A **public catalog** where users can:
  - View live rendered previews of components
  - Copy JSX/Tailwind code blocks
  - Read installation and usage setup
- A clean and responsive UI inspired by modern component libraries
- **No inline editing** — strictly preview and copy functionality

## Features

- ✅ Private admin panel with Auth0 login
- ✅ Component upload system (title, category, description, code, usage guide)
- ✅ Real-time rendered preview of components
- ✅ Syntax-highlighted code display
- ✅ One-click copy button for easy code usage
- ✅ Category-based component listing
- ✅ Responsive and minimal design
- ✅ MERN stack architecture with clean separation of backend and frontend

## Tech Stack

### Frontend
- **React**
- **Tailwind CSS**
- **Axios**
- **React Router**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose)

### Authentication
- **Auth0** (restricted to a single admin account)

## Use Cases

- Personal library for reusable React + Tailwind components
- Self-hosted alternative to platforms like ReactBits, Tailwind UI, and ShadCN
- Public-facing documentation for component previews and usage instructions

## Project Structure
```
/client
  /src
    /components
    /pages
    /styles
    /utils
/server
  /controllers
  /routes
  /models
  /middleware
```

## Purpose

The goal of this project is to create a self-managed platform for storing, organizing, and showcasing my custom React + Tailwind components. It allows me to upload components privately while giving public users an easy way to preview, understand, and copy them into their own projects.

## License

MIT License
