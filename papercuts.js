import * as client from "./repo.js";
window.onerror = error;
async function error(e) {
  const alert = document.createElement("ion-alert");
  alert.header = "Error";
  alert.message = e;
  alert.buttons = ["OK"];

  document.body.appendChild(alert);
  alert.present();
  await alert.onDidDismiss();
  alert.remove();
}

async function addSource() {
  const alert = document.createElement("ion-alert");
  alert.header = "Add Source";
  alert.inputs = [
    {
      name: "url",
      value: "",
      type: "url",
      placeholder: "Enter a Source URL"
    }
  ];
  alert.buttons = [
    {
      text: "Cancel",
      role: "cancel",
      cssClass: "secondary"
    },
    {
      text: "Add",
      handler: async e => {
        try {
          await client.addSource(e.url);
          await refreshSources();
        } catch (e) {
          error("The URL you entered wasn't a valid source");
        }
      }
    }
  ];
  document.body.appendChild(alert);
  alert.present();
  await alert.onDidDismiss();
  alert.remove();
}

function createSourceListItem(repo) {
  let iis = document.createElement("ion-item-sliding");
  let ii = document.createElement("ion-item");
  let ia = document.createElement("ion-avatar");
  ia.slot = "start";
  let iai = document.createElement("img");
  iai.src = repo.icon;
  ia.appendChild(iai);
  ii.appendChild(ia);
  let il = document.createElement("ion-label");
  let ilh = document.createElement("h2");
  ilh.textContent = repo.name;
  il.appendChild(ilh);
  let ilp = document.createElement("p");
  ilp.textContent = repo.url;
  il.appendChild(ilp);
  ii.appendChild(il);
  iis.appendChild(ii);
  let iios = document.createElement("ion-item-options");
  iios.side = "start";
  iis.appendChild(iios);
  let iio = document.createElement("ion-item-option");
  iio.color = "danger";
  iio.textContent = "Remove";
  iio.addEventListener("click", () => {
    client.removeSource(repo.url);
    refreshSources();
  });
  iios.appendChild(iio);
  return iis;
}

function createPackageListItem(pkg) {
  let ii = document.createElement("ion-item");
  ii.addEventListener("click", () => {
    depict(pkg);
  });
  let ia = document.createElement("ion-avatar");
  ia.slot = "start";
  let iai = document.createElement("img");
  iai.src = pkg.icon;
  ia.appendChild(iai);
  ii.appendChild(ia);
  let il = document.createElement("ion-label");
  let ilh = document.createElement("h2");
  ilh.textContent = pkg.name;
  il.appendChild(ilh);
  let ilp = document.createElement("p");
  ilp.textContent = `v${pkg.version} - ${pkg.author.name} - ${pkg.arch}`;
  il.appendChild(ilp);
  ii.appendChild(il);
  return ii;
}

document.querySelector("#addSource").addEventListener("click", () => {
  addSource();
});
window.client = client;

const sourceList = document.querySelector("#sourceList");
const packageList = document.querySelector("#packageList");

const wait = ms => new Promise(c => setTimeout(c, ms));

let filters = {
  onlyCompatible: true
};

function loadPackageList() {
  packageList.innerHTML = "";
  let p = client.getDb().packages;
  if (filters.onlyCompatible) p = p.filter(e => e.compatible);
  p.forEach(e => {
    packageList.appendChild(createPackageListItem(e));
  });
}

async function refreshSources() {
  const loading = document.createElement("ion-loading");
  loading.message = "Loading sources...";
  document.body.appendChild(loading);
  await Promise.all([
    loading.present(),
    (async () => {
      await client.init();
      sourceList.innerHTML = "";
      client.getDb().repos.forEach(e => {
        sourceList.appendChild(createSourceListItem(e));
      });
      loadPackageList();
    })(),
    wait(1000)
  ]);
  await loading.dismiss();
  loading.remove();
}

customElements.define(
  "depiction-page",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
<ion-header>
  <ion-toolbar>
    <ion-title></ion-title>
    <ion-buttons slot="primary">
      <ion-button shape="round" fill="solid" class="get"> &nbsp;&nbsp;GET&nbsp;&nbsp; </ion-button>
      <ion-button class="close">
        <ion-icon slot="icon-only" name="close"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
  <div style="-webkit-overflow-scrolling:touch; width:100%;height:100%;overflow:auto;border:0:margin:none;"><iframe style="width:100%;height:100%;overflow:auto;border:0:margin:none;" scrolling="yes" frameborder="0"></iframe></div>
</ion-content>`;
      const modalElement = document.querySelector("ion-modal");
      const pkg = modalElement.componentProps;
      this.querySelector("iframe").src = pkg.depiction;
      this.querySelector(".close").addEventListener("click", e =>
        modalElement.dismiss()
      );
      this.querySelector(".get").addEventListener("click", e => {
        modalElement.dismiss();
        installUi(pkg);
      });
      this.querySelector("ion-title").textContent = pkg.name;
    }
  }
);

async function installUi(pkg){
  let toInstall=client.resolveDeps(pkg)
}

async function depict(pkg) {
  // create the modal with the `modal-page` component
  const modalElement = document.createElement("ion-modal");
  modalElement.component = "depiction-page";
  modalElement.componentProps = pkg;

  // present the modal
  document.body.appendChild(modalElement);
  modalElement.present();
  await alert.onDidDismiss();
  alert.remove();
}

refreshSources();
