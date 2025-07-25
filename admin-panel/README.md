# Modern Admin Panel

A modern, responsive Admin Panel built with Next.js 15, TypeScript, Tailwind CSS, and ShadCN UI components.

## ✨ Features

- 🎨 **Modern Design**: Clean, professional admin dashboard interface
- 🌓 **Dark/Light Theme**: Automatic theme switching with manual toggle
- 📱 **Responsive**: Mobile-first responsive design
- 🔐 **Authentication Ready**: Login page and protected routes structure
- 🎯 **Dashboard Layout**: Sidebar navigation with top navbar
- 📊 **Sample Pages**: Dashboard Overview, User Management, Settings, Reports
- ⚡ **Animations**: Smooth page transitions with Framer Motion
- 🧩 **Component Library**: Built with ShadCN UI components
- 🎯 **TypeScript**: Full type safety and better developer experience

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Theme Management**: next-themes
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard pages
│   │   ├── users/          # User management
│   │   ├── reports/        # Reports page
│   │   └── settings/       # Settings page
│   ├── login/              # Login page
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # ShadCN UI components
│   ├── layouts/            # Layout components
│   ├── navigation/         # Navigation components
│   └── theme-provider.tsx  # Theme provider
├── hooks/                  # Custom React hooks
└── lib/                    # Utility functions
```

## 🎯 Pages & Features

### Authentication
- **Login Page**: Modern login form with theme toggle
- **Protected Routes**: Dashboard pages require authentication

### Dashboard
- **Overview**: Statistics cards, recent activity, quick actions
- **User Management**: User list with search, filtering, and actions
- **Reports**: Report generation with chart templates
- **Settings**: Application configuration with tabbed interface

### Navigation
- **Sidebar**: Collapsible sidebar with icons and active states
- **Top Navbar**: User menu, notifications, and theme toggle
- **Mobile Responsive**: Mobile menu with smooth animations

## 🎨 Theme Support

The admin panel supports both light and dark themes:
- Automatic theme detection based on system preference
- Manual theme toggle button in the navbar
- Persistent theme selection using next-themes

## 🔧 Customization

### Adding New Pages
1. Create a new page in `src/app/dashboard/`
2. Add navigation link in `src/components/navigation/sidebar.tsx`
3. Follow the existing pattern for layout and animations

### Styling
- Customize colors in `src/app/globals.css`
- Modify ShadCN components in `src/components/ui/`
- Use Tailwind classes for custom styling

### Components
- All UI components use ShadCN conventions
- Custom components follow the established patterns
- Animations use Framer Motion for consistency

## 📱 Responsive Design

The admin panel is fully responsive:
- **Mobile**: Collapsible sidebar with overlay
- **Tablet**: Responsive grid layouts
- **Desktop**: Full sidebar with optimal spacing

## 🚀 Production Ready

- Optimized build configuration
- TypeScript for type safety
- ESLint for code quality
- Responsive design patterns
- Accessibility considerations

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
