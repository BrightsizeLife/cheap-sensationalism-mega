/*
 * pact-display.js · the [display] panel. Link it in <head> so a reader's
 * choices apply before the first paint; it wires the panel once the page
 * has loaded. Saved in this browser only (localStorage), because these are
 * one reader's conveniences, not data.
 *
 * Everything here also follows the device on its own (dark mode, more
 * contrast, less motion, browser text size) through tokens.css; the panel
 * is for readers who want something different from their device.
 *
 * Markup: see references/components.md, "display settings". The toggle is
 * [data-pact-display-toggle] with aria-controls pointing at the panel; the
 * inputs are radios named pact-theme, pact-size, pact-motion and checkboxes
 * named pact-spacing and pact-links.
 */
(function () {
  "use strict";
  var KEY = "pact-display-v1", root = document.documentElement;
  var S = { theme: "system", size: "100", motion: "system", spacing: false, links: false };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || "{}"); for (var k in saved) if (k in S) S[k] = saved[k]; } catch (e) {}

  function set(attr, value, off) { if (value === off || value === false) root.removeAttribute(attr); else root.setAttribute(attr, value === true ? "on" : value); }
  function apply() {
    set("data-pact-theme", S.theme, "system");
    set("data-pact-size", S.size, "100");
    set("data-pact-motion", S.motion, "system");
    if (S.spacing) root.setAttribute("data-pact-spacing", "open"); else root.removeAttribute("data-pact-spacing");
    if (S.links) root.setAttribute("data-pact-links", "underline"); else root.removeAttribute("data-pact-links");
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }
  function sync(panel) {
    [["pact-theme", "theme"], ["pact-size", "size"], ["pact-motion", "motion"]].forEach(function (p) {
      Array.prototype.forEach.call(panel.querySelectorAll('input[name="' + p[0] + '"]'), function (r) { r.checked = r.value === String(S[p[1]]); });
    });
    var sp = panel.querySelector('input[name="pact-spacing"]'), ln = panel.querySelector('input[name="pact-links"]');
    if (sp) sp.checked = !!S.spacing; if (ln) ln.checked = !!S.links;
  }
  apply();

  function wire() {
    var toggle = document.querySelector("[data-pact-display-toggle]");
    var panel = toggle && document.getElementById(toggle.getAttribute("aria-controls"));
    if (!panel) return;
    sync(panel);
    function open(show) {
      panel.hidden = !show; toggle.setAttribute("aria-expanded", String(show));
      if (show) { var h = panel.querySelector("[tabindex='-1']"); if (h) h.focus(); } else toggle.focus();
    }
    toggle.addEventListener("click", function () { open(panel.hidden); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-pact-display-open]"), function (b) { b.addEventListener("click", function () { open(true); window.scrollTo(0, 0); }); });
    Array.prototype.forEach.call(panel.querySelectorAll("[data-pact-display-close]"), function (b) { b.addEventListener("click", function () { open(false); }); });
    panel.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "pact-theme") S.theme = t.value;
      if (t.name === "pact-size") S.size = t.value;
      if (t.name === "pact-motion") S.motion = t.value;
      if (t.name === "pact-spacing") S.spacing = t.checked;
      if (t.name === "pact-links") S.links = t.checked;
      apply();
    });
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") open(false); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire); else wire();
})();
