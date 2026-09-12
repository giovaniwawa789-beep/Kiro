/* Nunes & Lucato — comportamento do site institucional.
   Sem dependências. Progressive enhancement: tudo funciona sem JS. */
(function () {
  'use strict';

  /* ---------------- ano no rodapé ---------------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* ---------------- menu mobile ---------------- */
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('mobileMenu');

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    menu.hidden = true;
    document.body.style.overflow = '';
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) {
        closeMenu();
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Fechar menu');
        menu.hidden = false;
        document.body.style.overflow = 'hidden';
      }
    });

    // fecha ao navegar
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // se voltar ao desktop com o menu aberto
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) closeMenu();
    });
  }

  /* ---------------- animação de entrada ---------------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll(
    '.section-title, .section-lead, .hier-item, .card, .step, .callout, ' +
    '.bioma-stat, .bioma-col, .conf-table, .docs, .cta-title, .cta-lead, .cta-form'
  );

  /* Verificação por posição, agendada em requestAnimationFrame.
     Não usa IntersectionObserver de propósito: o IO não garante callback para
     elementos que entram e saem da viewport entre frames (scroll muito rápido
     ou salto por link de âncora), e o custo disso seria conteúdo preso em
     opacity:0 — ou seja, invisível. Aqui, se o elemento já passou da dobra,
     ele é revelado, sem depender de o navegador ter notado a transição. */
  if (!reduced) {
    var pendentes = Array.prototype.slice.call(targets);
    pendentes.forEach(function (el) { el.classList.add('reveal'); });

    var agendado = false;

    function checa() {
      var limite = window.innerHeight - 40;
      for (var i = pendentes.length - 1; i >= 0; i--) {
        if (pendentes[i].getBoundingClientRect().top < limite) {
          pendentes[i].classList.add('is-visible');
          pendentes.splice(i, 1);
        }
      }
      if (!pendentes.length) {
        window.removeEventListener('scroll', agenda);
        window.removeEventListener('resize', agenda);
      }
    }

    function agenda() {
      if (agendado) return;
      agendado = true;
      window.requestAnimationFrame(function () { agendado = false; checa(); });
    }

    window.addEventListener('scroll', agenda, { passive: true });
    window.addEventListener('resize', agenda);
    checa();
  }

  /* ---------------- formulário ----------------
     Não há backend: o envio abre um e-mail pré-preenchido.
     Ao integrar um endpoint, troque o corpo do handler por um fetch(). */
  var form = document.getElementById('contatoForm');
  var msg = document.getElementById('formMsg');

  if (form && msg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var empresa = form.elements.empresa.value.trim();
      var email = form.elements.email.value.trim();
      var volume = form.elements.volume.value.trim();

      if (!empresa || !email) {
        msg.setAttribute('data-state', 'error');
        msg.textContent = 'Preencha a empresa e o e-mail para continuar.';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.setAttribute('data-state', 'error');
        msg.textContent = 'Confira o e-mail informado.';
        return;
      }

      var corpo =
        'Empresa: ' + empresa + '\n' +
        'E-mail: ' + email + '\n' +
        'Volume aproximado: ' + (volume || 'não informado') + '\n\n' +
        'Gostaria de receber uma proposta de destinação de resíduo têxtil.';

      msg.removeAttribute('data-state');
      msg.textContent = 'Abrindo seu e-mail com a solicitação preenchida…';

      // TODO: substituir pelo e-mail comercial oficial da Nunes & Lucato.
      window.location.href =
        'mailto:contato@nuneselucato.com.br' +
        '?subject=' + encodeURIComponent('Solicitação de proposta — ' + empresa) +
        '&body=' + encodeURIComponent(corpo);
    });
  }
})();
