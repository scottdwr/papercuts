let db = {};
let sources = [];
let arch = (navigator.userAgent.match(/iP.+? OS ([\d_]+)/) || [
  "",
  ""
])[1].split("_")[0];
arch = arch ? "ios" + arch : "ios13";

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
        dbpackage.compatible =
          dbpackage.arch == arch || dbpackage.arch == "universal";
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
export function getPackage(id) {
  return db.packages
    .filter(e => e.id == id && e.compatible)
    .sort((a, b) => cmp(a.version, b.version))[0];
}
// Embed-a-Engine 1.0
function cmp(a, b) {
  let pa = a.split(".");
  let pb = b.split(".");
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    let na = Number(pa[i]);
    let nb = Number(pb[i]);
    if (isNaN(na)) na = 0;
    if (isNaN(nb)) nb = 0;
    if (na > nb) return -1;
    if (nb > na) return 1;
  }
  return 0;
}
export function resolveDeps(pkg) {
  alert(pkg)
  let deps = new Set();
  deps.add(pkg.id);
  for (let dep of pkg.depends) {
    resolveDeps(getPackage(dep)).forEach(e => deps.add(e));
  }
  return [...deps];
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
  sources = JSON.parse(
    localStorage.getItem("sources") || '["https://papercuts-repo.glitch.me/"]'
  );
  await Promise.all(sources.map(e => load(e)));
}
