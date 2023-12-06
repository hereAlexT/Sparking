drop policy "Enable delete for users based on user_id" on "public"."notes";

create table "public"."note_images" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "note_id" uuid not null,
    "user_id" uuid not null
);


alter table "public"."note_images" enable row level security;

CREATE UNIQUE INDEX note_images_pkey ON public.note_images USING btree (id);

alter table "public"."note_images" add constraint "note_images_pkey" PRIMARY KEY using index "note_images_pkey";

alter table "public"."note_images" add constraint "note_images_note_id_fkey" FOREIGN KEY (note_id) REFERENCES notes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."note_images" validate constraint "note_images_note_id_fkey";

alter table "public"."note_images" add constraint "note_images_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."note_images" validate constraint "note_images_user_id_fkey";

create policy "Enable delete for users based on user_id"
on "public"."note_images"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Enable insert for users based on user_id"
on "public"."note_images"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for users based on user_id"
on "public"."note_images"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable update for users based on email"
on "public"."note_images"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable delete for users based on user_id"
on "public"."notes"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));



