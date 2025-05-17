import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/editor');
  // Or, if you want to return a component:
  // return null; // Or a loading spinner, etc.
}
