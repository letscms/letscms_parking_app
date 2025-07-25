# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a modern, responsive Admin Panel built with Next.js 15, TypeScript, Tailwind CSS, and ShadCN UI components.

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Theme Management**: next-themes (light/dark mode)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Architecture Guidelines
- Use App Router for routing and layout management
- Implement proper folder structure with components, hooks, lib, and layouts directories
- Follow ShadCN UI component patterns and conventions
- Use TypeScript for type safety
- Implement responsive design with Tailwind CSS
- Support both light and dark themes
- Use Framer Motion for smooth page transitions and animations

## Component Structure
- UI components should be in `src/components/ui/` (ShadCN components)
- Custom components should be in `src/components/`
- Layouts should be in `src/components/layouts/`
- Hooks should be in `src/hooks/`
- Utilities should be in `src/lib/`

## Styling Guidelines
- Use Tailwind CSS classes for styling
- Follow dark mode conventions with proper color schemes
- Ensure accessibility with proper contrast ratios
- Use ShadCN UI design tokens and CSS variables

## Authentication & Routes
- Implement authentication-ready layout structure
- Use protected route patterns
- Support login/logout functionality
- Handle authentication state management
