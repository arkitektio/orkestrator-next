import {useState, useEffect} from 'react';
import {MessageProcessor} from '@a2ui/web_core/v0_9';
import {A2uiSurface} from '@a2ui/react/v0_9';
import { myCatalog } from './catalog';


export default function BlokRenderer() {
  // 1. Create the processor and feed it messages.
  const [processor] = useState(() => {
    const p = new MessageProcessor([myCatalog]);
    p.processMessages(sampleAgentMessages);
    return p;
  });

  // 2. Set up listeners to keep the UI up to date as messages arrive.
  const [surfaces, setSurfaces] = useState(() => Array.from(processor.model.surfacesMap.values()));
  useEffect(() => {
    const sync = () => setSurfaces(Array.from(processor.model.surfacesMap.values()));

    const createdSub = processor.onSurfaceCreated(sync);
    const deletedSub = processor.onSurfaceDeleted(sync);

    return () => {
      createdSub.unsubscribe();
      deletedSub.unsubscribe();
    };
  }, [processor]);

  // 3. Render every surface the agent has created.
  return (
    <div className="a2ui-container">
      {surfaces.length === 0 && <div>Waiting for agent...</div>}
      {surfaces.map(surface => (
        <A2uiSurface key={surface.id} surface={surface} />
      ))}
    </div>
  );
}

// In a real app, these messages would come from an agent via WebSocket, SSE, etc.
// Here we hardcode them to show the message format.
const sampleAgentMessages = [
  {
    version: 'v0.9' as const,
    createSurface: {surfaceId: 'main-chat', catalogId: myCatalog.id},
  },
  {
    version: 'v0.9' as const,
    updateComponents: {
      surfaceId: 'main-chat',
      components: [
        {id: 'root', component: 'MyProfile', props: {username: 'Alice', bio: 'Software Engineer', avatarUrl: 'https://example.com/avatar.jpg'}}
      ],
    },
  },
];
