const init = async () => {
  const version = document.getElementById("openfin-version");
  const gh = document.getElementById("gh");
  const csb = document.getElementById("csb");

  if (window.fin) {
    const runtimeVersion = await window.fin.System.getVersion();
    version.innerText = runtimeVersion;
  } else {
    version.innerText = "Not Applicable (you are running a browser)";
  }

  if (window.location.href.indexOf("github") > -1) {
    gh.style.display = "unset";
    csb.style.display = "none";
  } else {
    gh.style.display = "none";
    csb.style.display = "unset";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  init();
});
