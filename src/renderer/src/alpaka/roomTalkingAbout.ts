export type RoomTalkingAboutStructure = {
  identifier: string;
  object: string;
};

const ROOM_TALKING_ABOUT_STORAGE_KEY = "alpaka-room-talking-about";

const readStoredRoomTalkingAbout = (): Record<string, RoomTalkingAboutStructure[]> => {
  if (typeof window === "undefined") {
    return {};
  }

  const rawValue = window.localStorage.getItem(ROOM_TALKING_ABOUT_STORAGE_KEY);

  if (!rawValue) {
    return {};
  }

  try {
    return JSON.parse(rawValue) as Record<string, RoomTalkingAboutStructure[]>;
  } catch {
    return {};
  }
};

const writeStoredRoomTalkingAbout = (
  value: Record<string, RoomTalkingAboutStructure[]>,
) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    ROOM_TALKING_ABOUT_STORAGE_KEY,
    JSON.stringify(value),
  );
};

export const storeRoomTalkingAbout = (
  roomId: string,
  structures: RoomTalkingAboutStructure[],
) => {
  const nextStructures = structures.filter(
    (structure) => structure.identifier && structure.object,
  );

  if (nextStructures.length === 0) {
    return;
  }

  const currentValue = readStoredRoomTalkingAbout();

  writeStoredRoomTalkingAbout({
    ...currentValue,
    [roomId]: nextStructures,
  });
};

export const getRoomTalkingAbout = (
  roomId: string,
): RoomTalkingAboutStructure[] => {
  return readStoredRoomTalkingAbout()[roomId] ?? [];
};
