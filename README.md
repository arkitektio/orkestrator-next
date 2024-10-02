[![codecov](https://codecov.io/gh/arkitektio/lok-server-next/branch/main/graph/badge.svg?token=UGXEA2THBV)](https://codecov.io/gh/arkitektio/orkestrator-next)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/arkitektio/orkestrator-next/)
![Maintainer](https://img.shields.io/badge/maintainer-jhnnsrs-blue)

# Orkestrator (Next)

This repository includes the Next version of Orkestrator frontend 
for the arkitekt platform. It is currently under development and not ready for production. 
If you are looking for the current version of Orkestrator, you can find it [here](https://github.com/arkitektio/orkestrator).

## Roadmap

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
- [ ] Move to React Query (suggested)
- [ ] Move to React TanStack Router (suggested)
- [x] Lazy Load Modules (only if corresponding service in Deployment)
- [ ] Hosted Deployment (e.g. on Vercel)


## Service Specific Next Features

### Lok

- [x] User Management
- [ ] Advanced App and Config Management (around Fakts)

### Mikro

- [x] Move to Mikro Next
- [X] Establish "Views" as central concept
- [ ] Deprecated OMERO metadata support

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
- [ ] Create App Store UI

### Omero-Ark

- [ ] Improve Omero UI
- [ ] Allow metadata editing in UI

### Port

- [x] Build deprecated Port UI (Port will be replaced by Kabinet)

### Kluster

- [ ] Build Kluster UI
- [ ] Elaborate on Dask-Cluster integration
- [ ] Provide support for other cluster 
 

