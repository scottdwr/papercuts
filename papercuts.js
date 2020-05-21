import * as client from "./repo.js";

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
      cssClass: "secondary",
      handler: () => {
        console.log("Confirm Cancel");
      }
    },
    {
      text: "Add",
      handler: async (e) => {
        try {
          await client.addSource(e.url);
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
  il.textContent = repo.name;
  ii.appendChild(il);
  iis.appendChild(ii);
  let iios = document.createElement("ion-item-options");
  iios.side = "start";
  iis.appendChild(iios);
  let iio = document.createElement("ion-item-option");
  iio.color = "danger";
  iio.textContent = "Remove";
  iios.appendChild(iio);
  return iis;
}

document.querySelector("#addSource").addEventListener("click", () => {
  addSource();
});
window.client=client;

const sourceList=document.querySelector("#sourceList");
(async () => {
  await client.init();
  sourceList.innerHTML="";
  client.getDb().repos.forEach(e=>{
    sourceListcreateSourceListItem(e)
  })
})();
