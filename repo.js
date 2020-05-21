let db = {};
let sources=[];
db.repos = {};
db.packages = [];
async function load(repo) {
  let meta = await (await fetch(repo + "/meta.json")).json();
  if (meta.id && meta.name && meta.version) {
    db.repos[meta.id + ""] = {};
    db.repos[meta.id + ""].name = meta.name + "";
    db.repos[meta.id + ""].version = meta.version + "";
    db.repos[meta.id + ""].description = meta.description + "" || "";
    db.repos[meta.id + ""].icon =
      meta.icon + "" || "https://via.placeholder.com/57";
    let packages = await (await fetch(repo + "/packages.json")).json();
    for (let pakage of packages) {
      let dbpackage = {};
      dbpackage.id = pakage.id + "";
      dbpackage.version = pakage.version + "";
      dbpackage.name = pakage.name + "";
      dbpackage.link = pakage.link + "";
      dbpackage.arch = pakage.arch + "" || "universal";
      dbpackage.author = pakage.author || {
        name: "No Contact",
        link: "about:blank"
      };
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
export function getDb() {
  return db;
}
export function addSource(url){
  sources.push(url);
  localStorage.setItem("sources",JSON.stringify(sources))
  load(url)
}
export function init() {
  sources=JSON.parse(localStorage.getItem("sources")||"[]");
  sources.forEach(load)
}