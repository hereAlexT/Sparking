-- create policy "Give users access to own folder twar1h_0"
-- on "storage"."objects"
-- as permissive
-- for select
-- to authenticated
-- using (((bucket_id = 'note_images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


-- create policy "Give users access to own folder twar1h_1"
-- on "storage"."objects"
-- as permissive
-- for insert
-- to authenticated
-- with check (((bucket_id = 'note_images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


-- create policy "Give users access to own folder twar1h_2"
-- on "storage"."objects"
-- as permissive
-- for delete
-- to authenticated
-- using (((bucket_id = 'note_images'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



