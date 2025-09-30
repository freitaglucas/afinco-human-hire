-- Clean up any placeholder/test data
DELETE FROM public.talent_pool;
DELETE FROM public.interactions;
DELETE FROM public.applications;
DELETE FROM public.jobs;
DELETE FROM public.companies;
DELETE FROM public.candidate_profiles;
DELETE FROM public.recruiter_profiles;
DELETE FROM public.user_roles WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- Update the handle_new_user function to create role-specific profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role app_role;
BEGIN
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'candidate');
  
  -- Create base profile
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    user_role
  );
  
  -- Create user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  -- Create role-specific profile
  IF user_role = 'candidate' THEN
    INSERT INTO public.candidate_profiles (
      user_id,
      current_position,
      location,
      skills,
      desired_positions,
      years_of_experience,
      willing_to_relocate
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'current_position', ''),
      COALESCE(NEW.raw_user_meta_data->>'location', ''),
      COALESCE((NEW.raw_user_meta_data->>'skills')::text[], ARRAY[]::text[]),
      COALESCE((NEW.raw_user_meta_data->>'desired_positions')::text[], ARRAY[]::text[]),
      0,
      false
    );
  ELSIF user_role = 'recruiter' THEN
    INSERT INTO public.recruiter_profiles (
      user_id,
      company_name,
      position
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'position', '')
    );
  END IF;
  
  RETURN NEW;
END;
$$;