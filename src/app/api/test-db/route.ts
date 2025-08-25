import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test exam_types table
    const { data: examTypes, error: examError } = await supabase
      .from('exam_types')
      .select('*')
      .limit(5);
    
    // Test skill_types table  
    const { data: skillTypes, error: skillError } = await supabase
      .from('skill_types')
      .select('*')
      .limit(5);
    
    const results = {
      examTypes: {
        data: examTypes,
        error: examError?.message,
        count: examTypes?.length || 0
      },
      skillTypes: {
        data: skillTypes,
        error: skillError?.message,
        count: skillTypes?.length || 0
      }
    };
    
    console.log('Database test results:', results);
    
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({ 
      error: 'Database test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}