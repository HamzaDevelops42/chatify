# Supabase Setup Guide

This document explains how to fully recreate the Supabase backend used in this project.

Follow the steps **in order**.

---

## 1. Database Schema (Tables, Types & Indexes)

Go to **Supabase Dashboard → SQL Editor** and run the following SQL.

```sql
-- Chat type
CREATE TYPE chat_type AS ENUM ('direct', 'group');

-- Role of a user inside a chat
CREATE TYPE chat_member_role AS ENUM ('admin', 'member');

-- Friend request state
CREATE TYPE friend_request_status AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_type chat_type NOT NULL,
  name text,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.chat_members (
  chat_id uuid NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role chat_member_role NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  edited_at timestamptz
);

CREATE TABLE public.friend_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status friend_request_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT no_self_requests CHECK (sender_id <> receiver_id),
  UNIQUE (sender_id, receiver_id)
);

CREATE TABLE public.friends (
  user1_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT no_self_friend CHECK (user1_id <> user2_id),
  PRIMARY KEY (user1_id, user2_id)
);

CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_chat_members_user_id ON public.chat_members(user_id);
CREATE INDEX idx_friend_requests_receiver ON public.friend_requests(receiver_id);
CREATE INDEX idx_friend_requests_sender ON public.friend_requests(sender_id);
```

---

## 2. Row Level Security (RLS Policies)

Enable RLS on all tables and add policies.

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read profiles"
ON public.profiles
FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Disable profile deletion"
ON public.profiles
FOR DELETE
TO authenticated
USING (false);

CREATE POLICY "Chat members can see their memberships"
ON public.chat_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Only chat members can select messages"
ON public.messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_members cm
    WHERE cm.chat_id = messages.chat_id
    AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Only chat members can send messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM chat_members cm
    WHERE cm.chat_id = messages.chat_id
    AND cm.user_id = auth.uid()
  )
);
```

---

## 3. Auth Trigger (Profile Auto-Creation)

Create the function and trigger that runs when a new user signs up.

```sql
create or replace function public.handle_new_oauth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    base_username text;
    final_username text;
    counter int := 1;
    avatar_url text;
    provided_username text;
begin
    provided_username := new.raw_user_meta_data ->> 'username';

    if provided_username is not null and length(trim(provided_username)) > 0 then
        base_username := lower(provided_username);
    else
        base_username := split_part(new.email, '@', 1);
    end if;

    final_username := base_username;

    while exists (
        select 1 from public.profiles where username = final_username
    ) loop
        final_username := base_username || counter;
        counter := counter + 1;
    end loop;

    avatar_url := new.raw_user_meta_data ->> 'picture';

    insert into public.profiles (id, username, avatar_url)
    values (new.id, final_username, avatar_url);

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_oauth_user();
```

---

## 4. Authentication Setup

In **Supabase Dashboard → Authentication → Providers**:

- Enable **Email**
- Enable **Google**

### Important (Production)
You may want to set your production URL:

**Supabase → Authentication → URL Configuration → Site URL**

Set this to your deployed domain 

---

