import { useQuery } from "@apollo/client";
import { EventInviteType } from "@wormgraph/helpers";
import { message } from "antd";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { QueryEventPartnerViewArgs } from "../../api/graphql/generated/types";
import {
  EventFE,
  GET_EVENT_BY_SLUG,
  EventPartnerViewResponseFE,
} from "./api.gql";

export interface EventContextType {
  event: EventFE | null;
  type: EventInviteType;
}

export const EventContext = createContext<EventContextType | null>(null);

export interface EventURLParams {
  type: EventInviteType;
  code: string | null;
}

export const parseEventType = (type: string | null): EventInviteType => {
  switch (type) {
    case EventInviteType.PLAYER:
      return EventInviteType.PLAYER;
    case EventInviteType.PROMOTER:
    default:
      return EventInviteType.PROMOTER;
  }
};

export const extractURLState_Event = () => {
  const url = new URL(window.location.href);
  const unparsedType = url.searchParams.get("type");
  const params: EventURLParams = {
    type: parseEventType(unparsedType),
    code: url.searchParams.get("code") as string | null,
  };

  return { INITIAL_URL_PARAMS: params };
};

interface EventProviderProps {}

const EventProvider = ({ children }: PropsWithChildren<EventProviderProps>) => {
  const [eventData, setEventData] = useState<EventFE | null>(null);
  const params = useMemo(() => extractURLState_Event().INITIAL_URL_PARAMS, []);
  const { data, loading, error } = useQuery<
    EventPartnerViewResponseFE,
    QueryEventPartnerViewArgs
  >(GET_EVENT_BY_SLUG, {
    variables: {
      slug: params.code as string,
    },
    skip: !params.code,
    onCompleted: (data: EventPartnerViewResponseFE) => {
      if (
        data?.eventPartnerView?.__typename === "EventPartnerViewResponseSuccess"
      ) {
        setEventData(data.eventPartnerView.event);
      } else {
        setEventData(null);
      }
    },
  });

  useEffect(() => {
    if (data?.eventPartnerView?.__typename === "ResponseError" || error) {
      message.error(
        "Error loading event data. Please ask the event organizer to check the event link."
      );
    }
  }, [data, error]);

  return (
    <EventContext.Provider
      value={{
        event: eventData,
        type: params.type,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventProvider = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEventProvider must be used within a EventProvider");
  }
  return context;
};

export default EventProvider;
