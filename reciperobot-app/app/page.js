import Image from "next/image";
import { Dashboard } from '@/components/Dashboard';
import RecipesTableCard from '@/components/Recipes/RecipesTableCard';
import PublicRecipes from './home/page';

export default function Home() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-between">
    //   Home View
    // </main>
    <PublicRecipes/>
  );
}
