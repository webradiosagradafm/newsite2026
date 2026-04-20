const authListener = auth.onAuthStateChange(
  async (event: any, nextSession: any) => {
    // Ignora o evento inicial pois o initAuth já cuida disso
    if (event === 'INITIAL_SESSION') return;

    setSession(nextSession ?? null);
    setUser(nextSession?.user ?? null);

    if (nextSession?.user?.id) {
      await fetchFavorites(nextSession.user.id);
    } else {
      setFavorites([]);
    }

    setLoading(false);
  }
);
