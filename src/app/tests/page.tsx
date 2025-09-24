// src/app/tests/page.tsx

import TestsHero from "@/components/TestsHero";
import TestList from "@/components/TestList";
import { supabase } from "@/utils/supabaseClient";

export default async function TestsPage() {
  let tests = null;
  
  try {
    const { data, error } = await supabase.from('tests').select('*').order('name');
    
    if (error) {
      console.error("Error fetching tests:", error);
    } else {
      tests = data;
    }
  } catch (err) {
    console.error("Failed to connect to database:", err);
  }

  return (
    <>
      <TestsHero />
      <TestList tests={tests} />
    </>
  )
}