import { useSelector } from 'react-redux';
import EventCard from './EventCard';

const Events = () => {
  const events = useSelector(state => state.events.events);

  return (
    <div className="p-10 text-center mt-16 min-h-screen">
      <h2 className="text-3xl font-bold">Upcoming Events</h2>
      <div className={`mt-6 gap-6 w-full ${
        events.length >= 4 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
          : 'flex flex-wrap justify-center items-center'
      }`}>
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;