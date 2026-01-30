import React, { useState } from 'react';
import { Calendar, MapPin, ExternalLink, Music, Filter, Clock, Ticket } from 'lucide-react';

/**
 * COMO ADICIONAR EVENTOS:
 * 
 * 1. Copie o modelo abaixo
 * 2. Cole no array EVENTS
 * 3. Preencha os dados
 * 4. Commit e push!
 * 
 * MODELO:
 * {
 *   id: PRÓXIMO_NÚMERO,
 *   artist: 'Nome do Artista',
 *   title: 'Nome do Tour/Show',
 *   date: 'YYYY-MM-DD',  // Formato: 2026-03-15
 *   time: '7:00 PM',      // Formato: 7:00 PM ou 19:00
 *   venue: 'Nome do Local',
 *   city: 'Cidade',
 *   state: 'Estado (sigla)',
 *   country: 'USA',
 *   description: 'Descrição curta do evento (opcional)',
 *   ticketUrl: 'https://link-para-ingressos.com',
 *   eventUrl: 'https://site-do-artista.com',
 *   featured: false,  // true para destacar o evento
 * },
 */

const EVENTS = [
  {
    id: 1,
    artist: 'Elevation Worship',
    title: 'The Blessing Tour 2026',
    date: '2026-03-15',
    time: '7:00 PM',
    venue: 'United Center',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    description: 'Experience an evening of powerful worship with Elevation Worship',
    ticketUrl: 'https://www.ticketmaster.com',
    eventUrl: 'https://elevationworship.com',
    featured: true,
  },
  {
    id: 2,
    artist: 'Lauren Daigle',
    title: 'Kaleidoscope Night Tour',
    date: '2026-04-20',
    time: '8:00 PM',
    venue: 'Madison Square Garden',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    description: 'Grammy Award-winning artist Lauren Daigle live in concert',
    ticketUrl: 'https://www.ticketmaster.com',
    eventUrl: 'https://laurendaigle.com',
    featured: true,
  },
  {
    id: 3,
    artist: 'Maverick City Music',
    title: 'Kingdom Tour',
    date: '2026-05-10',
    time: '7:30 PM',
    venue: 'Crypto.com Arena',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    description: 'Join Maverick City Music for an unforgettable worship experience',
    ticketUrl: 'https://www.axs.com',
    eventUrl: 'https://maverickcitymusic.com',
    featured: false,
  },
  {
    id: 4,
    artist: 'Kirk Franklin',
    title: 'The Long Live Love Tour',
    date: '2026-06-05',
    time: '8:00 PM',
    venue: 'State Farm Arena',
    city: 'Atlanta',
    state: 'GA',
    country: 'USA',
    description: 'The legendary Kirk Franklin brings his electrifying show to Atlanta',
    ticketUrl: 'https://www.ticketmaster.com',
    eventUrl: 'https://kirkfranklin.com',
    featured: false,
  },
  {
    id: 5,
    artist: 'for KING & COUNTRY',
    title: 'What Are We Waiting For Tour',
    date: '2026-07-12',
    time: '7:00 PM',
    venue: 'American Airlines Center',
    city: 'Dallas',
    state: 'TX',
    country: 'USA',
    description: 'Multi-platinum duo for KING & COUNTRY live on stage',
    ticketUrl: 'https://www.ticketmaster.com',
    eventUrl: 'https://forkingandcountry.com',
    featured: false,
  },
  {
    id: 6,
    artist: 'Chris Tomlin',
    title: 'Always Tour',
    date: '2026-08-15',
    time: '7:30 PM',
    venue: 'Red Rocks Amphitheatre',
    city: 'Morrison',
    state: 'CO',
    country: 'USA',
    description: 'An intimate evening of worship under the stars with Chris Tomlin',
    ticketUrl: 'https://www.axs.com',
    eventUrl: 'https://christomlin.com',
    featured: false,
  },
  {
    id: 7,
    artist: 'Tasha Cobbs Leonard',
    title: 'Hymns Live Tour',
    date: '2026-09-20',
    time: '7:00 PM',
    venue: 'State Farm Arena',
    city: 'Atlanta',
    state: 'GA',
    country: 'USA',
    description: 'Gospel powerhouse Tasha Cobbs Leonard performs classic hymns',
    ticketUrl: 'https://www.ticketmaster.com',
    eventUrl: 'https://tashacobbs.com',
    featured: false,
  },
  {
    id: 8,
    artist: 'TobyMac',
    title: 'The Theater Tour',
    date: '2026-10-08',
    time: '7:30 PM',
    venue: 'Bridgestone Arena',
    city: 'Nashville',
    state: 'TN',
    country: 'USA',
    description: 'High-energy concert experience with Christian hip-hop legend TobyMac',
    ticketUrl: 'https://www.ticketmaster.com',
    eventUrl: 'https://tobymac.com',
    featured: false,
  },
];

interface Event {
  id: number;
  artist: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  state: string;
  country: string;
  description?: string;
  ticketUrl?: string;
  eventUrl: string;
  featured?: boolean;
}

const EventsPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'thisMonth' | 'featured'>('all');

  const filterEvents = () => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    switch (selectedFilter) {
      case 'upcoming':
        return EVENTS.filter(event => new Date(event.date) >= now);
      case 'thisMonth':
        return EVENTS.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= now && eventDate <= thisMonth;
        });
      case 'featured':
        return EVENTS.filter(event => event.featured);
      default:
        return EVENTS;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredEvents = filterEvents().sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

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
              Gospel Events & Concerts
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Don't miss out on the most powerful worship experiences and gospel concerts
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedFilter === 'all'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setSelectedFilter('featured')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedFilter === 'featured'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700'
            }`}
          >
            ⭐ Featured
          </button>
          <button
            onClick={() => setSelectedFilter('upcoming')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedFilter === 'upcoming'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setSelectedFilter('thisMonth')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              selectedFilter === 'thisMonth'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No events found for the selected filter.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} {selectedFilter !== 'all' && `(${selectedFilter})`}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => {
                const daysUntil = getDaysUntil(event.date);
                const isUpcoming = daysUntil >= 0;
                
                return (
                  <div
                    key={event.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 ${
                      event.featured ? 'ring-2 ring-orange-400' : ''
                    }`}
                  >
                    {/* Featured Badge */}
                    {event.featured && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 text-xs font-bold flex items-center gap-1">
                        <span>⭐</span> FEATURED EVENT
                      </div>
                    )}
                    
                    {/* Event Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                      <div className="flex items-start justify-between mb-2">
                        <Music className="w-6 h-6 flex-shrink-0" />
                        {isUpcoming && daysUntil <= 30 && (
                          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                            {daysUntil === 0 ? 'TODAY' : daysUntil === 1 ? 'TOMORROW' : `${daysUntil} days`}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-1">{event.artist}</h3>
                      <p className="text-orange-100 text-sm font-medium">{event.title}</p>
                    </div>

                    {/* Event Details */}
                    <div className="p-6 space-y-4">
                      {/* Description */}
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      {/* Date & Time */}
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {formatDate(event.date)}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {event.time}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {event.venue}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.city}, {event.state}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 space-y-2">
                        {event.ticketUrl && (
                          <a
                            href={event.ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
                          >
                            <Ticket className="w-4 h-4" />
                            Get Tickets
                          </a>
                        )}
                        <a
                          href={event.eventUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          More Info
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Submit Event CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Have an event to share?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Submit your gospel event or concert information to be featured on our events page
          </p>
          <a
            href="mailto:events@praisefm.com?subject=Event Submission"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <Calendar className="w-5 h-5" />
            Submit Event
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;