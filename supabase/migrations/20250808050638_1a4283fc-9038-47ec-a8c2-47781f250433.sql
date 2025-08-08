-- 1) Helper function to extract host from a URL (immutable for expression indexes)
CREATE OR REPLACE FUNCTION public.extract_host(url text)
RETURNS text
LANGUAGE sql
IMMUTABLE
STRICT
AS $$
  SELECT lower(split_part(split_part(regexp_replace(coalesce(url, ''), '^[a-z]+://', ''), '/', 1), ':', 1));
$$;

-- 2) Validation and sanitization trigger for reviews
CREATE OR REPLACE FUNCTION public.validate_and_sanitize_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Trim basic fields
  IF NEW.name IS NOT NULL THEN
    NEW.name := NULLIF(left(btrim(NEW.name), 100), '');
  END IF;

  NEW.extension_slug := left(btrim(NEW.extension_slug), 200);
  IF NEW.extension_slug IS NULL OR NEW.extension_slug = '' THEN
    RAISE EXCEPTION 'extension_slug is required';
  END IF;

  NEW.openedx_url := left(btrim(NEW.openedx_url), 2048);
  IF public.extract_host(NEW.openedx_url) IS NULL OR public.extract_host(NEW.openedx_url) = '' THEN
    RAISE EXCEPTION 'openedx_url must include a valid host';
  END IF;

  -- Rating bounds
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'rating must be between 1 and 5';
  END IF;

  -- Sanitize and cap comment
  IF NEW.comment IS NOT NULL THEN
    NEW.comment := left(regexp_replace(NEW.comment, '<[^>]*>', '', 'g'), 2000);
    NEW.comment := NULLIF(btrim(NEW.comment), '');
  END IF;

  RETURN NEW;
END;
$$;

-- 3) Trigger to run validations on INSERT/UPDATE
DROP TRIGGER IF EXISTS trg_reviews_validate ON public.reviews;
CREATE TRIGGER trg_reviews_validate
BEFORE INSERT OR UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.validate_and_sanitize_review();

-- 4) Ensure updated_at stays fresh on update
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Rate-limit function: max 3 reviews per host per extension in a rolling 24h window
CREATE OR REPLACE FUNCTION public.can_submit_review(_extension_slug text, _openedx_url text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    SELECT count(*)
    FROM public.reviews r
    WHERE r.extension_slug = _extension_slug
      AND public.extract_host(r.openedx_url) = public.extract_host(_openedx_url)
      AND r.created_at > now() - interval '1 day'
  ) < 3;
$$;

-- 6) Replace overly permissive INSERT policy with rate-limited policy
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'reviews' AND policyname = 'Anyone can create reviews'
  ) THEN
    EXECUTE 'DROP POLICY "Anyone can create reviews" ON public.reviews';
  END IF;
END $$;

CREATE POLICY "Public can create limited reviews per host/day"
ON public.reviews
FOR INSERT
WITH CHECK ( public.can_submit_review(extension_slug, openedx_url) );

-- Keep public read access as-is (do not alter existing SELECT policy)

-- 7) Helpful indexes for query performance and rate-limit lookups
CREATE INDEX IF NOT EXISTS idx_reviews_extension_created
  ON public.reviews (extension_slug, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_openedx_host_extension
  ON public.reviews (public.extract_host(openedx_url), extension_slug);
