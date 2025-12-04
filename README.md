# Translate Manga

A Next.js application for translating manga.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your configuration values.

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
├── app/              # Next.js app directory
├── components/       # React components
│   └── ui/          # Reusable UI components (shadcn/ui style)
├── lib/             # Library utilities
├── services/        # API calls and external services
├── types/           # TypeScript type definitions
└── utils/           # Utility functions and constants
```

### UI Components

This project uses **shadcn/ui** style components built on top of:
- **Radix UI** primitives (accessible)
- **Tailwind CSS** for styling
- Custom components in `components/ui/`

Available components:
- `Button` - Button component (can act as link or button)
- `Input` - Input field (supports file upload)
- `Card` - Card container
- `Dialog` - Modal dialog
- `Progress` - Progress bar
- `UploadImage` - Image upload component with preview

### Example Usage

```tsx
import { UploadImage } from "@/components/upload-image";

export default function Page() {
  const handleTranslate = async (image) => {
    // Call Google AI API here
    // Example: await translateImage(image);
  };

  return (
    <UploadImage
      onTranslate={handleTranslate}
      maxFiles={10}
    />
  );
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
