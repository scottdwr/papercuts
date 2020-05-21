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
      handler: async (...e) => {
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



document.querySelector("#addSource").addEventListener("click",()=>{
  addSource()
})

(async()=>{
  await client.init()
  
})()