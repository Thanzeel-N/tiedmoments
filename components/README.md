# UI components

The project already uses Next.js and TypeScript. Tailwind CSS v4 and the shadcn-compatible component structure are now configured; no new project or migration is needed.

- Reusable UI: `components/ui/`
- Global styles and Tailwind theme tokens: `app/globals.css`
- Class-name helper: `lib/utils.ts`
- Import alias: `@/*` resolves from the project root through `tsconfig.json`.
- shadcn configuration: `components.json`
- Tailwind processing: `postcss.config.mjs`

Keep reusable primitives in `components/ui` so shadcn additions and the supplied `@/components/ui/...` imports resolve consistently. Page content stays in `app/page.tsx`.

To add another shadcn component later, run `npx shadcn@latest add <component-name>` from the project root. Review generated changes before overwriting customized components. Run `npm install` when checking out the project; all required dependencies are recorded in the lockfile.

## Hero gallery

`ui/gallery.tsx` adapts the supplied spring-animated photo stack. It accepts `animationDelay`, up to five `photos`, heading content through `children`, and an optional `onPhotoSelect` callback. `ui/button.tsx` is the supplied shadcn Button implementation. `demo.tsx` exports the standalone demo.

The live hero keeps its original text and uses the client's local wedding photographs, including their existing blur placeholders. The page's existing lightbox opens on click, tap, or Enter. Desktop cards support constrained drag; touch devices retain vertical scrolling. Reduced-motion preferences disable spring movement and dragging. Animation state stays local; no context provider is required.

Tailwind uses the official Next.js integration: https://tailwindcss.com/docs/installation/framework-guides/nextjs
Motion accessibility reference: https://motion.dev/docs/react-use-reduced-motion
