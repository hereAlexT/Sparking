# Sparking

## Generate Typescript Types

`npx supabase gen types typescript --local --schema public > db.types.ts`

## DB migration

https://supabase.com/docs/reference/cli/supabase-db-lint

1. mannually create bucket
2. diff db
   `supabase db diff -f [filename]`
3. diff storage policy
   `supabase db diff --schema storage`

## Bucket List

---

name: note_images
Allowed MIME Types: image/jpeg, image/png
