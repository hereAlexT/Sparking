create table "public"."notes" (
    "id" uuid not null default gen_random_uuid(),
    "body" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "user_id" uuid not null default auth.uid()
);


alter table "public"."notes" enable row level security;

CREATE UNIQUE INDEX notes_pkey ON public.notes USING btree (id);

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."notes" add constraint "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."notes" validate constraint "notes_user_id_fkey";

create policy "Enable delete for users based on user_id"
on "public"."notes"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."notes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."notes"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable update for users based on id"
on "public"."notes"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



