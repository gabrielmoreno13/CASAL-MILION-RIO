-- Create table for couple invites
CREATE TABLE IF NOT EXISTS public.couple_invites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    code TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now() + interval '24 hours') NOT NULL
);
-- RLS Policies
ALTER TABLE public.couple_invites ENABLE ROW LEVEL SECURITY;
-- Allow creator to read their invite
CREATE POLICY "Users can view their own invites" ON public.couple_invites FOR
SELECT USING (auth.uid() = created_by);
-- Allow anyone with the code to read the invite (to verify it)
-- Note: In a real app, this should be stricter, potentially using a function to verify instead of direct read
CREATE POLICY "Anyone can read pending invites by code" ON public.couple_invites FOR
SELECT USING (status = 'pending');
-- Allow creator to create invites
CREATE POLICY "Users can create invites" ON public.couple_invites FOR
INSERT WITH CHECK (auth.uid() = created_by);
-- Allow update when accepting
CREATE POLICY "Users can accept invites" ON public.couple_invites FOR
UPDATE USING (status = 'pending');