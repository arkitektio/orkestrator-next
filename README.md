[![codecov](https://codecov.io/gh/arkitektio/orkestrator-next/branch/main/graph/badge.svg?token=UGXEA2THBV)](https://codecov.io/gh/arkitektio/orkestrator-next)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/arkitektio/orkestrator-next/)
![Maintainer](https://img.shields.io/badge/maintainer-jhnnsrs-blue)

# Orkestrator (Next)

This repository includes the Next version of Orkestrator frontend 
for the arkitekt platform. It is currently under development and not ready for production. 
If you are looking for the current version of Orkestrator, you can find it [here](https://github.com/arkitektio/orkestrator).

> [!IMPORTANT]
> This version of Orkestrator is only working with the next version of the arkitekt platform. It is not compatible with the released version of the platform.


# Installation

While the new version of Orkestrator is still under development, you can install it by downloading one of the releases
from the [release page](https://github.com/arkitektio/orkestrator-next/releases) fitting your operating system.

### Linux

We provide a both an AppImage and a deb package for Linux. The AppImage should work on most distributions, while the deb package is specifically for Debian based distributions like Ubuntu.

### MacOS

Because the application is not signed (because it freaking costs money and is a pain in the ...) you need to "dequarantine" the application
before you will be able to open it. After installation you can do this by running the following command in your terminal (search "terminal" in spotlight):

```bash
xattr -c /Applications/orkestrator-next.app # or wherever you installed it
```

This willl remove the quarantine attribute from the application and you should be able to open it.
We are sorry for the inconvenience.

### Windows

Just download the installer and run it. It should install the application and create a desktop shortcut for you.
Windows might ask you if you really want to install the application, because it is not signed. YOu can safely
ignore this warnign and proceed with the installation. Follow the instructions [here](https://www.minitool.com/backup-tips/windows-protected-your-pc.html)

# Roadmap

Before the new version of Orkestrator can be merged into the main repository, the following features need to be implemented:

## General Next Features

- [x] Build around arkitekt-ts (instead of custom graphql clients)
- [x] Move Basic UI to Shadcn/UI
- [x] Move to Vite
- [x] Move to React 18
- [x] Move to Electron (Allows us to finally use SSL on the network)
- [x] New Workflow Engine (Fluss)
- [x] Integrate Kabinet App Store 
- [x] Move to new GraphQL Protocols (subscriptions based on graphql-ws, standardized error and param handling (pagination(filter))
- [ ] Basic UI Testing
- [ ] User Stories (e.g. documentation for specific user stories)
- [ ] Documentation, Documentation, Documentation
- [x] Lazy Load Modules (only if corresponding service in Deployment)
- [ ] Hosted Deployment (e.g. on Goethe Cluster)
- [x] CI/CD Pipeline


## Service Specific Next Features

### Lok

- [x] User Management
- [ ] Advanced App and Config Management (around Fakts)

### Mikro

- [x] Move to Mikro Next
- [X] Establish "Views" as central concept
- [X] Deprecated OMERO metadata support

### Fluss

- [x] Establish new Workflow UI + Engine (typesafe, wizard, ...) (looks nice)
- [X] Move to Fluss Next
- [x] More tighlty integrate Schedulers in UI
- [ ] Allow Resource Management in UI ( provisional UI for resource management)

### Rekuest

- [x] Move to Rekuest Next
- [ ] Build UI for scheduled tasks, and task management
- [ ] Hookify Rekuest (useNode, useTemplate, ...)

### Kabinet

- [x] Establish Kabinet
- [X] Create App Store like Feature
- [X] Create App Store UI

### Omero-Ark

- [ ] Improve Omero UI
- [ ] Allow metadata editing in UI

### Port

- [x] Build deprecated Port UI (Port will be replaced by Kabinet)

### Kluster

- [ ] Build Kluster UI
- [ ] Elaborate on Dask-Cluster integration
- [ ] Provide support for other cluster 

### Elektro

- [ ] Implement basic trace visualization
 

