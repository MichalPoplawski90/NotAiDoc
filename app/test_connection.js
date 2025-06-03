const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

// Test connection script
async function testSupabaseConnection() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  console.log('🔍 Testing Supabase connection...');
  console.log('URL:', process.env.SUPABASE_URL);
  
  try {
    // Test 1: Basic connection
    const { data, error } = await supabase
      .from('document_types')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Connection ERROR:', error.message);
      if (error.message.includes('relation "document_types" does not exist')) {
        console.log('📋 SCHEMA NOT DEPLOYED - need to run database/schema.sql');
        return false;
      }
    } else {
      console.log('✅ Connection SUCCESS!');
      console.log('📋 Document types found:', data?.length || 0);
      
      // Test 2: Check basic tables exist
      const tables = ['users', 'cases', 'documents', 'user_styles', 'style_examples'];
      
      for (const table of tables) {
        const { error: tableError } = await supabase
          .from(table)
          .select('id')
          .limit(1);
          
        if (tableError) {
          console.log(`❌ Table "${table}" ERROR:`, tableError.message);
        } else {
          console.log(`✅ Table "${table}" exists`);
        }
      }
      
      return true;
    }
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
    return false;
  }
}

testSupabaseConnection().then(success => {
  if (success) {
    console.log('\n🎉 SUPABASE READY FOR DEVELOPMENT!');
  } else {
    console.log('\n⚠️  NEED TO SETUP DATABASE SCHEMA FIRST');
  }
  process.exit(0);
}); 