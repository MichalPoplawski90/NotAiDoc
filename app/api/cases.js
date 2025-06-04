import supabase from '../utils/supabase';

/**
 * Upewnia się, że użytkownik istnieje w tabeli users
 * Tworzy rekord jeśli nie istnieje (upsert)
 */
async function ensureUserExists() {
  const user = supabase.auth.user();
  
  if (!user) {
    throw new Error('Użytkownik nie jest zalogowany');
  }

  // Sprawdź czy user istnieje w custom tabeli users
  const { data: existingUser, error: selectError } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = not found
    console.error('Błąd sprawdzania użytkownika:', selectError);
    throw selectError;
  }

  // Jeśli user nie istnieje, utwórz go
  if (!existingUser) {
    console.log('🔄 Tworzenie rekordu użytkownika w bazie danych...');
    
    const { error: insertError } = await supabase
      .from('users')
      .insert([{
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Użytkownik',
      }]);

    if (insertError) {
      console.error('Błąd tworzenia użytkownika:', insertError);
      throw insertError;
    }

    console.log('✅ Użytkownik utworzony w bazie danych');
  }

  return user;
}

/**
 * Pobiera wszystkie sprawy dla zalogowanego użytkownika
 */
export async function getCases() {
  try {
    // Upewnij się, że user istnieje w tabeli users
    const user = await ensureUserExists();

    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Błąd pobierania spraw:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('getCases error:', error);
    throw error;
  }
}

/**
 * Tworzy nową sprawę
 */
export async function createCase({ title, description, documentType }) {
  try {
    // Upewnij się, że user istnieje w tabeli users
    const user = await ensureUserExists();

    // Przygotuj dane do zapisu
    const caseData = {
      title: title.trim(),
      description: description?.trim() || null,
      user_id: user.id,
      status: 'active',
      // Dodamy document_type_id później, gdy będziemy mieć typy dokumentów w bazie
    };

    const { data, error } = await supabase
      .from('cases')
      .insert([caseData])
      .select()
      .single();

    if (error) {
      console.error('Błąd tworzenia sprawy:', error);
      throw error;
    }

    console.log('✅ Sprawa utworzona:', data);
    return data;
  } catch (error) {
    console.error('createCase error:', error);
    throw error;
  }
}

/**
 * Aktualizuje sprawę
 */
export async function updateCase(caseId, updates) {
  try {
    // Supabase v1.x - użyj auth.user() zamiast auth.getUser()
    const user = supabase.auth.user();
    
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    const { data, error } = await supabase
      .from('cases')
      .update(updates)
      .eq('id', caseId)
      .eq('user_id', user.id) // Zabezpieczenie - użytkownik może edytować tylko swoje sprawy
      .select()
      .single();

    if (error) {
      console.error('Błąd aktualizacji sprawy:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('updateCase error:', error);
    throw error;
  }
}

/**
 * Usuwa sprawę
 */
export async function deleteCase(caseId) {
  try {
    // Supabase v1.x - użyj auth.user() zamiast auth.getUser()
    const user = supabase.auth.user();
    
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', caseId)
      .eq('user_id', user.id); // Zabezpieczenie

    if (error) {
      console.error('Błąd usuwania sprawy:', error);
      throw error;
    }

    console.log('✅ Sprawa usunięta:', caseId);
    return true;
  } catch (error) {
    console.error('deleteCase error:', error);
    throw error;
  }
} 