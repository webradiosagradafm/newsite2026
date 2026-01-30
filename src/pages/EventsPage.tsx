import React, { useState } from 'react';
import { Calendar, MapPin, ExternalLink, Music, Search, Loader, Info } from 'lucide-react';

interface BandsintownEvent {
  id: string;
  artist_id: string;
  url: string;
  datetime: string;
  title: string;
  description: string;
  venue: {
    name: string;
    location: string;
    city: string;
    region: string;
    country: string;
    latitude: string;
    longitude: string;
  };
  lineup: string[];
  offers: Array<{
    type: string;
    url: string;
    status: string;
  }>;
}

interface Event {
  id: string;
  artist: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  state: string;
  country: string;
  ticketUrl?: string;
  eventUrl: string;
}

const EventsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [artistName, setArtistName] = useState('');

  const searchEvents = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setArtistName(searchQuery.trim());
    
    try {
      // Bandsintown API - usa o nome do app como ID
      const APP_ID = 'praisefm_usa';
      
      const response = await fetch(
        `https://rest.bandsintown.com/artists/${encodeURIComponent(searchQuery.trim())}/events?app_id=${APP_ID}`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          setError(`No events found for "${searchQuery}". Try searching for another artist.`);
          setEvents([]);
          return;
        }
        throw new Error('Failed to fetch events');
      }
      
      const data: BandsintownEvent[] = await response.json();
      
      if (data.length === 0) {
        setError(`No upcoming events found for "${searchQuery}".`);
        setEvents([]);
        return;
      }
      
      const formattedEvents = data.map((event) => ({
        id: event.id,
        artist: searchQuery.trim(),
        title: event.title || `${searchQuery} Live`,
        date: new Date(event.datetime).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: new Date(event.datetime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        venue: event.venue.name,
        city: event.venue.city,
        state: event.venue.region,
        country: event.venue.country,
        ticketUrl: event.offers?.[0]?.url,
        eventUrl: event.url
      }));
      
      // Ordenar por data
      formattedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      setError('Unable to load events. Please try again later.');
      console.error('Error fetching events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const popularArtists = [
    'Elevation Worship',
    'Maverick City Music',
    'Hillsong Worship',
    'Lauren Daigle',
    'Chris Tomlin',
    'for KING & COUNTRY',
    'Casting Crowns',
    'Kirk Franklin',
    'TobyMac',
    'MercyMe'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Gospel Events & Concerts
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8">
              Search for your favorite gospel artists and discover their upcoming shows
            </p>

            {/* Search Bar */}
            <form onSubmit={searchEvents} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artist name (e.g., Lauren Daigle, Kirk Franklin)..."
                  className="w-full px-6 py-4 pr-32 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-300 text-lg"
                />
                <button
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Popular Artists Quick Search */}
      {!hasSearched && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Popular Gospel Artists
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Click on an artist to see their upcoming events
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {popularArtists.map((artist) => (
              <button
                key={artist}
                onClick={() => {
                  setSearchQuery(artist);
                  // Trigger search automatically
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    if (form) {
                      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }
                  }, 100);
                }}
                className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 transition-all shadow-sm hover:shadow-md font-medium"
              >
                {artist}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Section */}
      {hasSearched && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Searching for events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button
                onClick={() => {
                  setHasSearched(false);
                  setSearchQuery('');
                  setError(null);
                }}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Search Again
              </button>
            </div>
          ) : events.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {events.length} Upcoming {events.length === 1 ? 'Event' : 'Events'} for {artistName}
                </h2>
                <button
                  onClick={() => {
                    setHasSearched(false);
                    setSearchQuery('');
                    setEvents([]);
                  }}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Search for another artist
                </button>
              </div>

              {/* Events Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Event Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                      <div className="flex items-start justify-between mb-2">
                        <Music className="w-6 h-6 flex-shrink-0" />
                      </div>
                      <h3 className="text-xl font-bold mb-1">{event.artist}</h3>
                      <p className="text-orange-100 text-sm">{event.title}</p>
                    </div>

                    {/* Event Details */}
                    <div className="p-6 space-y-4">
                      {/* Date & Time */}
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {event.date}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.time}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {event.venue}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.city}, {event.state} {event.country !== 'United States' && `• ${event.country}`}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 flex gap-3">
                        {event.ticketUrl && (
                          <a
                            href={event.ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-center font-medium text-sm"
                          >
                            Get Tickets
                          </a>
                        )}
                        <a
                          href={event.eventUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Details
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-2">How to use:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Search for any gospel or Christian artist by name</li>
                <li>View all their upcoming tour dates and locations</li>
                <li>Click "Get Tickets" to purchase tickets directly</li>
                <li>Event data is powered by Bandsintown</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;