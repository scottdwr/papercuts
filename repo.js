let db = {};
let sources = [];
let arch = (navigator.userAgent.match(/iP.+? OS ([\d_]+)/)||["",""])[1].split("_")[0];
arch=arch?"ios"+arch:"ios13";

db.repos = [];
db.packages = [];
async function load(repo, dryrun) {
  let meta = await (await fetch(repo + "/meta.json")).json();
  if (meta.id && meta.name && meta.version) {
    let dbrepo = {};
    dbrepo.url = repo;
    dbrepo.id = meta.id + "";
    dbrepo.name = meta.name + "";
    dbrepo.version = meta.version + "";
    dbrepo.description = meta.description + "" || "";
    dbrepo.icon = meta.icon + "" || "https://via.placeholder.com/57";
    if (!dryrun) {
      db.repos.push(dbrepo);
      let packages = await (await fetch(repo + "/packages.json")).json();
      for (let pakage of packages) {
        let dbpackage = {};
        dbpackage.id = pakage.id + "";
        dbpackage.icon = pakage.icon + "" || "https://via.placeholder.com/57";
        dbpackage.version = pakage.version + "";
        dbpackage.name = pakage.name + "";
        dbpackage.link = pakage.link + "";
        dbpackage.arch = pakage.arch + "" || "universal";
        dbpackage.author = pakage.author || {
          name: "No Contact",
          link: "about:blank"
        };
        dbpackage.compatible=(dbpackage.arch==arch||dbpackage.arch=="universal");
        dbpackage.maintainer = pakage.maintainer || dbpackage.author;
        dbpackage.description = pakage.description + "" || "";
        dbpackage.depends = pakage.depends || [];
        dbpackage.depiction = pakage.depiction + "" || false;

        if (!dbpackage.depiction) {
          dbpackage.depiction =
            "https://papercuts.glitch.me/fallback-depiction.html#" +
            encodeURIComponent(JSON.stringify(dbpackage));
        }
        db.packages.push(dbpackage);
      }
    }
  }
}
export function getDb() {
  return db;
}
export async function addSource(url) {
  try {
    await load(url, true);
    sources.push(url);
    localStorage.setItem("sources", JSON.stringify(sources));
  } catch (e) {
    throw new Error("Invalid Source!");
  }
}
export function removeSource(url) {
  sources = sources.filter(e => e != url);
  localStorage.setItem("sources", JSON.stringify(sources));
}
export async function init() {
  db = {};
  sources = [];
  db.repos = [];
  db.packages = [];
  sources = JSON.parse(localStorage.getItem("sources") || "[]");
  await Promise.all(sources.map(e => load(e)));
}

customElements.define('modal-page', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-header>
  <ion-toolbar>
    <ion-title>Modal Header</ion-title>
    <ion-buttons slot="primary">
      <ion-button onClick="dismissModal()">
        <ion-icon slot="icon-only" name="close"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content class="ion-padding">
  Modal Content
</ion-content>`;
  }
});

function presentModal() {
  // create the modal with the `modal-page` component
  const modalElement = document.createElement('ion-modal');
  modalElement.component = 'modal-page';

  // present the modal
  document.body.appendChild(modalElement);
  return modalElement.present();
}