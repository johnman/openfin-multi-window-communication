# Multi Window Communication

This example shows three different ways of pushing out messages from a single source to multiple windows.

- Broadcast Channel using a Shared WebWorker
- Broadcast Channel from the Publisher Page
- OpenFin IAB Message Bus from the Publisher Page (only within OpenFin)

You may want to have one window/worker acting as the connection to a websocket and then have that push out data across multiple windows.

This hasn't been built as an example of best practice. The goal is to give you a way of defining what type of message you want to share, how you want to share that message and if there is a threshold in milliseconds you do not want a message to exceed.

## Running the example

You can use the link below to run the browser and OpenFin version (if you have OpenFin installed) of this example.

CodeSandbox: https://zxf6r.csb.app/

Github: https://johnman.github.io/openfin-multi-window-communication/index.html

If you want to browse the project using codesandbox you can visit:

https://codesandbox.io/s/openfin-multi-window-communication-zxf6r

## Customising this project:

Some things you will need to update:

In config/app.window.fin.json and app.csb.fin.json update:

- uuid : make the uuid unique
- visit https://www.openfin.co and request a trial/developer license
- update the url field to reflect your codesandbox url (or server)
- update the application icon to reflect your own icon
- update the name and description to reflect your application

More information about OpenFin:

- https://openfin.co/ -> main site
- https://developers.openfin.co/docs/getting-started => getting started guide
- https://github.com/openfin -> OpenFin Github repo
