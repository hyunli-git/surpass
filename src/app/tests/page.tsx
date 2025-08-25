// src/app/tests/page.tsx

import TestsHero from "@/components/TestsHero";
import TestList from "@/components/TestList";
import { supabase } from "@/utils/supabaseClient";

export default async function TestsPage() {
  const { data: tests, error } = await supabase.from('tests').select('*');

  if (error) {
    console.error("Error fetching tests:", error);
    return <p>Error: Unable to load test list.</p>;
  }

  return (
    <>
      <TestsHero />
      <TestList tests={tests} />
    </>
  )
}