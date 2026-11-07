/* Shared accessibility behaviour for the public help pages; no analytics or storage. */
(() => {
  "use strict";
  const root = document.documentElement;
  const names = {fr:"Français",en:"English",es:"Español",pt:"Português",nl:"Nederlands",de:"Deutsch",it:"Italiano"};
  const labels = {
    fr:{skip:"Aller au contenu",language:"Langue"}, en:{skip:"Skip to content",language:"Language"},
    es:{skip:"Ir al contenido",language:"Idioma"}, pt:{skip:"Saltar para o conteúdo",language:"Idioma"},
    nl:{skip:"Naar de inhoud",language:"Taal"}, de:{skip:"Zum Inhalt",language:"Sprache"},
    it:{skip:"Vai al contenuto",language:"Lingua"}
  };
  const bilingual = Array.from(document.querySelectorAll("style")).some(s => /html\.en/.test(s.textContent));
  if (bilingual) for (const link of document.querySelectorAll(".switch a[onclick]")) {
    const group = document.createElement("span"); group.className = "a11y-language-group"; group.setAttribute("role","group");
    for (const language of ["fr","en"]) {
      const button = document.createElement("button"); button.type = "button"; button.dataset.l = language;
      button.textContent = names[language]; button.className = "a11y-language";
      button.addEventListener("click", () => { root.classList.toggle("en", language === "en"); sync(); });
      group.append(button);
    }
    link.replaceWith(group);
  }
  const main = document.querySelector("main");
  let skip = null;
  if (main) {
    if (!main.id) main.id = "a11y-main-content";
    main.tabIndex = -1;
    skip = document.createElement("a"); skip.className = "a11y-skip"; skip.href = "#" + main.id;
    document.body.prepend(skip);
  }
  function sync() {
    if (bilingual) {
      const language = root.classList.contains("en") ? "en" : "fr";
      if (root.lang !== language) root.lang = language;
    }
    const language = (root.lang || "en").slice(0,2), text = labels[language] || labels.en;
    if (skip && skip.textContent !== text.skip) skip.textContent = text.skip;
    for (const group of document.querySelectorAll("nav.langs,#langs,.a11y-language-group")) group.setAttribute("aria-label",text.language);
    for (const button of document.querySelectorAll(".langs button[data-l],#langs button[data-l],.a11y-language[data-l]")) {
      const code = button.dataset.l;
      if (!button.classList.contains("a11y-language") && !button.childElementCount) {
        const flag = document.createElement("span"); flag.setAttribute("aria-hidden","true");
        flag.textContent = button.textContent; button.replaceChildren(flag);
      }
      if (names[code]) {button.setAttribute("aria-label",names[code]);button.lang = code;button.title = names[code];}
      if (button.classList.contains("a11y-language")) button.setAttribute("aria-pressed",String(code === language));
    }
  }
  sync();
  new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:["lang","class"]});
  for (const group of document.querySelectorAll("nav.langs,#langs")) new MutationObserver(sync).observe(group,{childList:true});
})();
