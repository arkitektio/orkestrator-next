import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Moq from '@moq/lite';

interface MoQPlayerProps {
  /** The URL of the MoQ relay server (e.g., "https://jhnnsrs-lab:4443") */
  relayHost: string;
  relayPort: number;
  /** The broadcast path to subscribe to (e.g., "clock/live") */
  broadcastPath: string;
  /** The track name within the broadcast (e.g., "video") */
  trackName?: string;
  /** Initial paused state */
  paused?: boolean;
}

/**
 * Fetches the certificate SHA256 hash from the relay for development use.
 * This is needed for WebTransport with self-signed certificates.
 */
async function fetchCertificateHash(relayHost: string, relayPort: number): Promise<Uint8Array | undefined> {
  try {
    const certUrl = `http://${relayHost}:${relayPort}/certificate.sha256`;

    const response = await fetch(certUrl);
    if (!response.ok) {
      console.warn('Could not fetch certificate hash, proceeding without it');
      return undefined;
    }

    // The certificate hash is returned as hex string
    const hexHash = await response.text();
    const cleanHex = hexHash.trim();

    // Convert hex string to Uint8Array
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
    }

    return bytes;
  } catch (err) {
    console.warn('Failed to fetch certificate:', err);
    return undefined;
  }
}

export const MoQPlayer: React.FC<MoQPlayerProps> = ({
  relayHost,
  relayPort,
  broadcastPath,
  trackName = 'video',
  paused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'connecting' | 'streaming' | 'error' | 'disconnected'>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isPaused, setIsPaused] = useState(paused);
  const [fps, setFps] = useState(0);

  const connectionRef = useRef<Moq.Connection.Established | null>(null);
  const isPausedRef = useRef(isPaused);

  // Keep ref in sync with state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    let isMounted = true;
    let frameCountLocal = 0;
    let lastFpsUpdate = performance.now();

    const initializeMoQ = async () => {
      try {
        setStatus('connecting');
        setErrorMessage('');

        // Fetch certificate hash for development
        const certHash = await fetchCertificateHash(relayHost, relayPort);

        // Establish connection using @moq/lite
        const serverUrl = new URL(`https://${relayHost}:${relayPort}/anon`);

        // Build WebTransport options with certificate hash if available
        const webtransportOptions: WebTransportOptions = {};
        if (certHash) {
          // Create a proper ArrayBuffer from the Uint8Array
          const hashBuffer = new ArrayBuffer(certHash.length);
          new Uint8Array(hashBuffer).set(certHash);

          webtransportOptions.serverCertificateHashes = [{
            algorithm: 'sha-256',
            value: hashBuffer,
          }];
        }

        const connection = await Moq.Connection.connect(serverUrl, {
          webtransport: webtransportOptions,
        });

        if (!isMounted) {
          connection.close();
          return;
        }

        connectionRef.current = connection;

        // Consume the broadcast
        const broadcast = connection.consume(broadcastPath as Moq.Path.Valid);

        // Subscribe to the video track
        const track = broadcast.subscribe(trackName, 0);

        setStatus('streaming');

        // Process incoming groups/frames
        const processFrames = async () => {
          while (isMounted) {
            try {
              // Read the next frame (JPEG data)
              const frameData = await track.readFrame();
              console.log('Received frame data:', frameData);

              if (!frameData || !isMounted) break;

              // Skip rendering if paused
              if (isPausedRef.current) continue;

              // Render JPEG to canvas - copy to a new ArrayBuffer to avoid SharedArrayBuffer issues
              const frameBuffer = new ArrayBuffer(frameData.length);
              new Uint8Array(frameBuffer).set(frameData);
              const blob = new Blob([frameBuffer], { type: 'image/jpeg' });
              const url = URL.createObjectURL(blob);

              const img = new Image();
              img.onload = () => {
                if (!isMounted || !canvasRef.current) {
                  URL.revokeObjectURL(url);
                  return;
                }

                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');

                if (ctx) {
                  // Resize canvas to match image if needed
                  if (canvas.width !== img.width || canvas.height !== img.height) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                  }

                  ctx.drawImage(img, 0, 0);
                }

                URL.revokeObjectURL(url);

                // Update FPS counter
                frameCountLocal++;

                const now = performance.now();
                if (now - lastFpsUpdate >= 1000) {
                  setFps(Math.round(frameCountLocal / ((now - lastFpsUpdate) / 1000)));
                  frameCountLocal = 0;
                  lastFpsUpdate = now;
                }
              };

              img.onerror = () => {
                URL.revokeObjectURL(url);
              };

              img.src = url;

            } catch (err) {
              if (isMounted) {
                console.error('Frame read error:', err);
              }
              break;
            }
          }
        };

        processFrames();

        // Handle connection closed
        connection.closed.then(() => {
          if (isMounted) {
            setStatus('disconnected');
          }
        });

      } catch (err) {
        console.error('MoQ Player Error:', err);
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
        }
      }
    };

    initializeMoQ();

    return () => {
      isMounted = false;
      connectionRef.current?.close();
    };
  }, [relayHost, relayPort, broadcastPath, trackName]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  return (
    <div className="moq-player relative bg-black rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="w-full h-auto max-h-[70vh] object-contain"
      />

      {/* Status overlay */}
      {status !== 'streaming' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            {status === 'connecting' && (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span>Connecting to stream...</span>
              </div>
            )}
            {status === 'disconnected' && (
              <span>Stream offline</span>
            )}
            {status === 'error' && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-red-400">Connection Error</span>
                {errorMessage && <span className="text-sm text-gray-300">{errorMessage}</span>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePause}
              className="hover:bg-white/20 p-1 rounded transition-colors"
              title={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {status === 'streaming' && (
              <span className="text-xs text-gray-300">{fps} FPS</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
              status === 'streaming' ? 'bg-green-500/80' :
              status === 'connecting' ? 'bg-yellow-500/80' :
              status === 'error' ? 'bg-red-500/80' : 'bg-gray-500/80'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                status === 'streaming' ? 'bg-green-200 animate-pulse' : 'bg-current'
              }`}></span>
              {status === 'streaming' ? 'LIVE' : status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
