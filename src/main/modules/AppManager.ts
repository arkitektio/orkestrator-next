import { app, Event } from 'electron';
import { AppModule } from './AppModule';

export class AppManager {
    private modules: AppModule[] = [];

    register(module: AppModule) {
        this.modules.push(module);
    }

    async setup() {
        // Setup all modules
        for (const module of this.modules) {
            if (module.setup) {
                await module.setup();
            }
        }

        // Intercept application lifecycle events and visit all registered modules
        app.on('before-quit', (event: Event) => {
            for (const module of this.modules) {
                if (module.onBeforeQuit) {
                    module.onBeforeQuit(event);
                }
            }
        });

        app.on('window-all-closed', () => {
            for (const module of this.modules) {
                if (module.onWindowAllClosed) {
                    module.onWindowAllClosed();
                }
            }
            // Typical Electron default behavior
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            for (const module of this.modules) {
                if (module.onActivate) {
                    module.onActivate();
                }
            }
        });

        app.on('second-instance', (event: Event, commandLine: string[], workingDirectory: string) => {
            for (const module of this.modules) {
                if (module.onSecondInstance) {
                    module.onSecondInstance(event, commandLine, workingDirectory);
                }
            }
        });
    }
}
