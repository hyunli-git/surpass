// src/app/tests/page.tsx

import TestsHero from "@/components/TestsHero";
import TestList from "@/components/TestList";
import { supabase } from "@/utils/supabaseClient";

export default async function TestsPage() {
  let tests = null;
  
  try {
    const { data, error } = await supabase.from('tests').select('*');
    
    if (error) {
      console.error("Error fetching tests:", error);
      // Continue with null tests instead of showing error
    } else {
      tests = data;
    }
  } catch (err) {
    console.error("Failed to connect to database:", err);
    // Continue with null tests
  }

  return (
    <>
      <TestsHero />
      <TestList tests={tests} />
    </>
  )
}