import { useTranslation } from "react-i18next";
import React from 'react';
const Timeline = ({
  events
}) => {
  const {
    t
  } = useTranslation();
  if (!events || events.length === 0) return <p className="text-gray-500">{t("Timeline.no_updates_yet")}</p>;
  return <div className="flow-root">
      <ul role="list" className="-mb-8">
        {events.map((event, eventIdx) => <li key={eventIdx}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" /> : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{event.status}</span>{' '}
                      - {event.description}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={event.date}>{new Date(event.date).toLocaleDateString()}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>)}
      </ul>
    </div>;
};
export default Timeline;