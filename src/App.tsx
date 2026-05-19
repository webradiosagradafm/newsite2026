<main className="flex-grow">

  {selectedProgram ? (
    <ProgramDetail
      program={selectedProgram}
      onBack={() => setSelectedProgram(null)}
      onViewSchedule={() => {
        setSelectedProgram(null)
        navigate('/schedule')
      }}
      onListenClick={togglePlayback}
      isPlaying={isPlaying}
    />
  ) : (
    <Routes>

      <Route
        path="/"
        element={
          <HomeBBC
            isPlaying={isPlaying}
            liveMetadata={liveMetadata}
            currentProgram={currentProgram}
            queue={queue}
            onListenClick={togglePlayback}
            onNavigateToProgram={
              setSelectedProgram
            }
            trackHistory={trackHistory}
          />
        }
      />

      <Route
        path="/music"
        element={<Playlist />}
      />

      <Route
        path="/schedule"
        element={
          <ScheduleList
            onNavigateToProgram={
              setSelectedProgram
            }
            onBack={() => navigate('/')}
          />
        }
      />

      <Route
        path="/devotional"
        element={<DevotionalPage />}
      />

      <Route
        path="/events"
        element={<EventsPage />}
      />

      <Route
        path="/new-releases"
        element={<NewReleasesPage />}
      />

      <Route
        path="/artists"
        element={<FeaturedArtistsPage />}
      />

      <Route
        path="/presenters"
        element={
          <PresentersPage
            onNavigateToProgram={
              setSelectedProgram
            }
          />
        }
      />

      <Route
        path="/live-recordings"
        element={<LiveRecordingsPage />}
      />

      <Route
        path="/help"
        element={<HelpCenterPage />}
      />

      <Route
        path="/feedback"
        element={<FeedbackPage />}
      />

      <Route
        path="/advertise"
        element={<AdvertisePage />}
      />

      <Route
        path="/privacy"
        element={<PrivacyPolicyPage />}
      />

      <Route
        path="/terms"
        element={<TermsOfUsePage />}
      />

      <Route
        path="/cookies"
        element={<CookiesPolicyPage />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )}
</main>
