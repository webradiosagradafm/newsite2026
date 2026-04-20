useEffect(() => {
  let isMounted = true;

  // Só usa o onAuthStateChange, remove o initAuth separado
  const { data: authListener } = auth.onAuthStateChange(
    async (event: any, nextSession: any) => {
      if (!isMounted) return;

      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user?.id) {
        await fetchFavorites(nextSession.user.id);
      } else {
        setFavorites([]);
      }

      // Só seta loading false depois que tudo resolveu
      if (isMounted) setLoading(false);
    }
  );

  return () => {
    isMounted = false;
    authListener?.subscription?.unsubscribe?.();
  };
}, []);
