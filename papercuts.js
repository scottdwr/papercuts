import Framework7 from "https://cdn.pika.dev/framework7@^5.4.0";
window.Framework7 = Framework7;
let app = new Framework7({
  // App root element
  root: "#app",
  // App Name
  name: "Papercuts",
  // App id
  id: "me.glitch.papercuts"
});
window.app = app;
let mainView = app.views.create(".view-main");
window.mainView = mainView;
