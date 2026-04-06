import { Event } from 'electron';

export interface AppModule {
    /**
     * Called when the module needs to set up its initial IPC handlers or internal state.
     */
    setup?: () => void | Promise<void>;

    /**
     * Called before the application starts closing its windows.
     * You can call event.preventDefault() to prevent the application from quitting.
     */
    onBeforeQuit?: (event: Event) => void | Promise<void>;

    /**
     * Called when all windows have been closed.
     */
    onWindowAllClosed?: () => void | Promise<void>;

    /**
     * Called when the application is activated (e.g., clicking on the dock icon in macOS).
     */
    onActivate?: () => void | Promise<void>;

    /**
     * Called when a second instance of the application is launched.
     */
    onSecondInstance?: (event: Event, commandLine: string[], workingDirectory: string) => void | Promise<void>;
}
