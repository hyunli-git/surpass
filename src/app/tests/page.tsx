// src/app/tests/page.tsx

import TestsHero from "@/components/TestsHero";
import TestList from "@/components/TestList";
import { supabase } from "@/utils/supabaseClient";

export default async function TestsPage() {
  const { data: tests, error } = await supabase.from('tests').select('*');

  if (error) {
    console.error("Error fetching tests:", error);
    return <p>오류: 시험 목록을 불러올 수 없습니다.</p>;
  }

  return (
    <>
      <TestsHero />
      <TestList tests={tests} />
    </>
  )
}