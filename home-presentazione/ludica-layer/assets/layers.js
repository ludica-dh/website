/* LUDiCa Filiera v2: progressive enhancement dei details nativi. */
(() => {
 'use strict';
 function init(root) {
  if (root.dataset.ready) return;
  const layers = [...root.querySelectorAll('[data-layer]')];
  const disclosures = [...root.querySelectorAll('details')];
  const steps = [...root.querySelectorAll('[data-step]')];
  const copies = [...root.querySelectorAll('[data-step-copy]')];
  const expandAll = root.querySelector('.lf-expand-all');
  const next = root.querySelector('.lf-next');
  const status = root.querySelector('[data-status]');
  if (layers.length !== 4 || steps.length !== 6 || copies.length !== 6 || !expandAll || !next || !status) return;
  root.dataset.ready = 'true'; root.classList.add('lf-enhanced');
  let count = 1, uid = 'ludica-filiera-' + count, current = -1;
  while (document.getElementById(uid)) uid = 'ludica-filiera-' + (++count);
  root.id = uid;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Map();
  function announce(text) { status.textContent = text; }
  function updateAllLabel() {
   const allOpen = layers.every(layer => layer.open);
   expandAll.textContent = allOpen ? 'Ricomponi i livelli −' : 'Esplodi tutti i livelli ↗';
   expandAll.setAttribute('aria-expanded', String(allOpen));
  }
  function cancelAnimation(details) {
   const old = animations.get(details);
   if (old) { old.onfinish = null; old.oncancel = null; old.cancel(); animations.delete(details); }
   details.style.height = ''; details.style.overflow = '';
  }
  // L’altezza è temporanea: a fine animazione torna automatica, anche con testi lunghi.
  function setOpen(details, open, animated = true) {
   cancelAnimation(details);
   const summary = details.querySelector('summary');
   if (details.open === open) { summary.setAttribute('aria-expanded', String(open)); updateAllLabel(); return; }
   const before = details.getBoundingClientRect().height;
   if (open) details.open = true;
   summary.setAttribute('aria-expanded', String(open));
   const after = open ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height;
   const finish = () => {
    details.open = open; details.style.height = ''; details.style.overflow = '';
    animations.delete(details); updateAllLabel();
   };
   if (!animated || reduce.matches || typeof details.animate !== 'function') { finish(); return; }
   details.style.overflow = 'hidden';
   const animation = details.animate([{height:before+'px'},{height:after+'px'}], {duration:360,easing:'cubic-bezier(.2,.7,.2,1)'});
   animations.set(details, animation);
   animation.onfinish = finish;
   animation.oncancel = finish;
  }
  disclosures.forEach((details, index) => {
   const summary = details.querySelector('summary');
   const body = summary.nextElementSibling;
   body.id = uid + '-branch-' + index;
   summary.setAttribute('aria-controls', body.id);
   summary.setAttribute('aria-expanded', String(details.open));
   summary.addEventListener('click', event => {
    event.preventDefault();
    // Se si interviene su un ramo, l’altezza dell’eventuale genitore torna libera.
    layers.forEach(parent => { if (parent !== details && parent.contains(details)) cancelAnimation(parent); });
    const desired = summary.getAttribute('aria-expanded') !== 'true';
    setOpen(details, desired);
    if (details.hasAttribute('data-layer')) announce((desired ? 'Aperto: ' : 'Chiuso: ') + summary.querySelector('strong').textContent);
   });
   details.addEventListener('toggle', () => {
    if (!animations.has(details)) summary.setAttribute('aria-expanded', String(details.open));
    updateAllLabel();
   });
   // Escape richiude il ramo più vicino e riporta il focus al suo controllo.
   details.addEventListener('keydown', event => {
    if (event.key === 'Escape' && details.open) {
     event.preventDefault(); event.stopPropagation();
     setOpen(details, false); summary.focus();
    }
   });
  });
  expandAll.hidden = false; next.hidden = false; updateAllLabel();
  expandAll.addEventListener('click', () => {
   const open = !layers.every(layer => layer.open);
   // Le operazioni collettive evitano animazioni di altezza annidate in conflitto.
   disclosures.forEach(details => cancelAnimation(details));
   layers.forEach(layer => setOpen(layer, open, false));
   if (!open) root.querySelectorAll('[data-node]').forEach(node => setOpen(node, false, false));
   updateAllLabel(); announce(open ? 'Aperti tutti e quattro i livelli. Seleziona una ramificazione per approfondire.' : 'Vista d’insieme ricomposta.');
  });
  function showStep(index) {
   current = index;
   const target = steps[index].dataset.target;
   steps.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
   copies.forEach((copy, i) => { copy.hidden = i !== index; });
   layers.forEach(layer => {
    const selected = layer.dataset.layer === target;
    layer.dataset.active = String(selected);
    setOpen(layer, selected, false);
   });
   next.textContent = index === steps.length - 1 ? 'Riparti dalla domanda ↻' : 'Prossima azione →';
   announce('Azione ' + (index + 1) + ' di ' + steps.length + ': ' + steps[index].textContent.trim() + '. Livello ' + target + ' aperto.');
  }
  steps.forEach((button, index) => {
   button.setAttribute('aria-controls', uid + '-flow-copy');
   button.addEventListener('click', () => showStep(index));
   button.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = (index + 1) % steps.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target = (index + steps.length - 1) % steps.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = steps.length - 1;
    if (target === undefined) return;
    event.preventDefault(); steps[target].focus(); showStep(target);
   });
  });
  root.querySelector('.lf-flow-copy').id = uid + '-flow-copy';
  next.addEventListener('click', () => showStep((current + 1) % steps.length));
  // All’avvio resta la vista d’insieme: un invito descrive l’interazione.
  copies.forEach(copy => { copy.hidden = true; });
  const invitation = document.createElement('p');
  invitation.className = 'lf-invitation';
  invitation.textContent = 'Scegli un’azione oppure premi “Inizia il percorso” per seguire la filiera.';
  root.querySelector('.lf-flow-copy').append(invitation);
  steps.forEach(button => button.addEventListener('click', () => { invitation.hidden = true; }));
  next.addEventListener('click', () => { invitation.hidden = true; });
 }
 function boot() { document.querySelectorAll('[data-ludica-filiera]').forEach(init); }
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
})();
