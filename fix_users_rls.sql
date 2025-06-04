-- Dodanie brakującej polityki INSERT dla tabeli users
CREATE POLICY user_insert ON users FOR INSERT WITH CHECK (auth.uid() = id); 