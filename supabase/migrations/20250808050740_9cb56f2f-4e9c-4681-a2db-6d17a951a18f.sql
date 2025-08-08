-- Fix linter warning: set search_path for extract_host
ALTER FUNCTION public.extract_host(text) SET search_path TO public;