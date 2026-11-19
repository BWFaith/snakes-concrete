/* Snakes Concrete LLC — shared behaviour */
(function () {
  "use strict";
  var C = window.SNAKES,
    $ = function (s, r) {
      return (r || document).querySelector(s);
    },
    $$ = function (s, r) {
      return Array.prototype.slice.call(
        (r || document).querySelectorAll(s),
      );
    };
  var reduce =
    window.matchMedia &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* header, progress bar, nav */
  var hdr = $(".hdr"),
    bar = $(".progress"),
    ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY,
        h =
          document.documentElement.scrollHeight -
          innerHeight;
      if (hdr) hdr.classList.toggle("stuck", y > 8);
      if (bar)
        bar.style.transform =
          "scaleX(" +
          (h > 0 ? Math.min(1, y / h) : 0) +
          ")";
      if (!reduce && innerWidth > 900)
        $$(".band-bg").forEach(function (b) {
          var r = b.parentNode.getBoundingClientRect();
          if (r.bottom > 0 && r.top < innerHeight)
            b.style.transform =
              "translate3d(0," +
              (
                (r.top + r.height / 2 - innerHeight / 2) *
                -0.12
              ).toFixed(1) +
              "px,0)";
        });
      ticking = false;
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var burger = $(".burger"),
    nav = $("#nav");
  if (burger) {
    burger.addEventListener("click", function () {
      var o = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", o);
      document.body.style.overflow = o ? "hidden" : "";
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }
  var more = $(".more");
  if (more) {
    var mb = $(".more-btn", more);
    mb.addEventListener("click", function (e) {
      e.stopPropagation();
      var o = more.classList.toggle("open");
      mb.setAttribute("aria-expanded", o);
    });
    document.addEventListener("click", function () {
      more.classList.remove("open");
      mb.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        more.classList.remove("open");
      }
    });
  }

  /* scroll reveal */
  var rev = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    rev.forEach(function (el) {
      io.observe(el);
    });
  } else
    rev.forEach(function (el) {
      el.classList.add("in");
    });
  /* safety net: anything on screen that is still hidden after a moment gets shown */
  function reveal() {
    rev.forEach(function (el) {
      if (
        !el.classList.contains("in") &&
        el.getBoundingClientRect().top < innerHeight * 1.05
      )
        el.classList.add("in");
    });
  }
  setTimeout(reveal, 1800);
  addEventListener("load", function () {
    setTimeout(reveal, 600);
  });
  addEventListener(
    "scroll",
    function () {
      clearTimeout(window.__rv);
      window.__rv = setTimeout(reveal, 400);
    },
    { passive: true },
  );

  /* data fill: contact details, socials, year */
  $$("[data-phone]").forEach(function (a) {
    var p =
      a.getAttribute("data-phone") === "2"
        ? C.phone2
        : C.phone;
    a.href = "tel:+1" + p.replace(/\D/g, "");
    if (!a.hasAttribute("data-keep")) a.textContent = p;
  });
  $$("[data-email]").forEach(function (a) {
    a.href = "mailto:" + C.email;
    if (!a.hasAttribute("data-keep"))
      a.textContent = C.email;
  });
  $$("[data-social]").forEach(function (a) {
    a.href = C.social[a.getAttribute("data-social")];
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-year]").forEach(function (s) {
    s.textContent = new Date().getFullYear();
  });
  function waLink(t) {
    return (
      "https://wa.me/" +
      C.whatsapp +
      "?text=" +
      encodeURIComponent(
        t ||
          "Hi Snakes Concrete, I would like a free estimate.",
      )
    );
  }
  $$("[data-wa]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-wa"));
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* before/after sliders */
  $$(".ba").forEach(function (b) {
    var r = $("input", b),
      a = $(".after", b),
      k = $(".knob", b);
    function set() {
      a.style.clipPath = "inset(0 0 0 " + r.value + "%)";
      k.style.left = r.value + "%";
    }
    r.addEventListener("input", set);
    set();
  });

  /* gallery filter + lightbox */
  var gal = $("#gallery");
  if (gal) {
    var figs = $$("figure", gal),
      vis = [],
      idx = 0;
    $$(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        $$(".chip").forEach(function (x) {
          x.setAttribute("aria-pressed", "false");
        });
        c.setAttribute("aria-pressed", "true");
        var f = c.getAttribute("data-f");
        figs.forEach(function (g) {
          g.classList.toggle(
            "hide",
            f !== "all" &&
              g
                .getAttribute("data-c")
                .split(" ")
                .indexOf(f) < 0,
          );
        });
      });
    });
    var lb = $(".lb"),
      li = $("img", lb),
      lc = $("p", lb);
    function show(i) {
      idx = (i + vis.length) % vis.length;
      var im = $("img", vis[idx]);
      li.src = im.currentSrc || im.src;
      li.alt = im.alt;
      lc.textContent = $(
        "figcaption",
        vis[idx],
      ).textContent;
    }
    function open(g) {
      vis = figs.filter(function (x) {
        return !x.classList.contains("hide");
      });
      show(vis.indexOf(g));
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      $(".x", lb).focus();
    }
    function close() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }
    figs.forEach(function (g) {
      $("button", g).addEventListener("click", function () {
        open(g);
      });
    });
    $(".x", lb).onclick = close;
    $(".pv", lb).onclick = function () {
      show(idx - 1);
    };
    $(".nx", lb).onclick = function () {
      show(idx + 1);
    };
    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    var tx = 0;
    lb.addEventListener(
      "touchstart",
      function (e) {
        tx = e.touches[0].clientX;
      },
      { passive: true },
    );
    lb.addEventListener("touchend", function (e) {
      var d = e.changedTouches[0].clientX - tx;
      if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1));
    });
  }

  /* email helper (EmailJS REST — no library needed) */
  window.sendEmails = function (params, opts) {
    var E = C.emailjs;
    opts = opts || {};
    if (!(E.publicKey && E.serviceId && E.ownerTemplateId))
      return Promise.reject(new Error("not-configured"));
    function post(tpl, p) {
      return fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: E.serviceId,
            template_id: tpl,
            user_id: E.publicKey,
            template_params: p,
          }),
        },
      ).then(function (r) {
        if (!r.ok) throw new Error("send-failed");
      });
    }
    var jobs = [
      post(
        E.ownerTemplateId,
        Object.assign({ to_email: C.email }, params),
      ),
    ];
    if (opts.customer && E.customerTemplateId)
      jobs.push(
        post(
          E.customerTemplateId,
          Object.assign(
            { to_email: params.customer_email },
            params,
          ),
        ),
      );
    return Promise.all(jobs);
  };

  /* contact form */
  var cf = $("#contactForm");
  if (cf)
    cf.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = $("#cfMsg"),
        d = new FormData(cf),
        btn = $("button[type=submit]", cf);
      if (d.get("website")) return; // honeypot
      var p = {
        quote_number: "MSG",
        customer_name: d.get("name"),
        customer_email: d.get("email"),
        customer_phone: d.get("phone"),
        address: "",
        service: d.get("topic"),
        details: "",
        estimate_low: "",
        estimate_high: "",
        preferred_date: "",
        time_window: "",
        notes: d.get("message"),
        breakdown_text: d.get("message"),
        breakdown_html:
          "<p>" +
          String(d.get("message")).replace(/</g, "&lt;") +
          "</p>",
        subject: "Website message from " + d.get("name"),
      };
      btn.disabled = true;
      btn.textContent = "Sending…";
      window
        .sendEmails(p, { customer: false })
        .then(function () {
          msg.className = "ok-box";
          msg.textContent =
            "Thanks, " +
            d.get("name") +
            ". Your message is on its way and we will reply soon.";
          cf.reset();
        })
        .catch(function () {
          var body =
            "Name: " +
            d.get("name") +
            "\nPhone: " +
            d.get("phone") +
            "\nEmail: " +
            d.get("email") +
            "\nTopic: " +
            d.get("topic") +
            "\n\n" +
            d.get("message");
          msg.className = "warn-box";
          msg.innerHTML =
            'Online sending is not switched on yet, so please send this from your email app: <a href="mailto:' +
            C.email +
            "?subject=" +
            encodeURIComponent(
              "Website message from " + d.get("name"),
            ) +
            "&body=" +
            encodeURIComponent(body) +
            '">open email draft</a>, or call <a href="tel:+1' +
            C.phone.replace(/\D/g, "") +
            '">' +
            C.phone +
            "</a>.";
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = "Send message";
        });
    });

  /* chat widget: call, WhatsApp and a quick-answer bot */
  var ic = {
    phone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.500-.7-1.700-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.2-.4.700-1.300.1-.2 0-.3 0-.4l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.200 5.200 5.200 0 0 0 1.100 2.800 11.900 11.900 0 0 0 4.600 4c1.700.7 2.400.8 3.200.7.500-.1 1.500-.6 1.700-1.200.2-.6.2-1.100.2-1.200-.1-.1-.3-.2-.5-.3z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.800 7L3 21l2-5.200A8 8 0 1 1 21 12z"/></svg>',
  };
  var fab = document.createElement("div");
  fab.className = "fab";
  fab.innerHTML =
    '<button class="bot" aria-label="Open quick answers chat" aria-expanded="false">' +
    ic.chat +
    '</button><a class="wa" data-wa aria-label="Chat on WhatsApp">' +
    ic.wa +
    '</a><a class="call" href="tel:+1' +
    C.phone.replace(/\D/g, "") +
    '" aria-label="Call ' +
    C.phone +
    '">' +
    ic.phone +
    "</a>";
  document.body.appendChild(fab);
  $(".wa", fab).href = waLink();
  $(".wa", fab).target = "_blank";
  $(".wa", fab).rel = "noopener";
  var chat = document.createElement("div");
  chat.className = "chat";
  chat.setAttribute("role", "dialog");
  chat.setAttribute("aria-label", "Quick answers");
  chat.innerHTML =
    '<header><div><b>Snakes Concrete</b><small>Quick answers. Real people on call and WhatsApp.</small></div><button aria-label="Close chat">&times;</button></header><div class="log" aria-live="polite"></div><div class="qr"></div>';
  document.body.appendChild(chat);
  var log = $(".log", chat),
    qr = $(".qr", chat),
    opened = false;
  var KB = {
    services: [
      "We pour driveways, walkways, patios and porches, slabs, foundations, basement and garage floors, retaining walls and stamped or decorative concrete, for homes and commercial sites.",
      "Pricing",
      "Service areas",
      "Free estimate",
    ],
    pricing: [
      "Every job is different, so we quote from your size, finish and site conditions. The quote calculator on the booking page gives you a range in about two minutes, and a free site estimate confirms the final number.",
      "Open quote calculator",
      "Free estimate",
      "Services",
    ],
    areas: [
      "We serve Georgia, Tennessee and Alabama, including Chattanooga, Rossville, Ringgold, Dalton, Cleveland, Dayton, Jasper, Signal Mountain and Lookout Mountain. Not on the list? Ask us.",
      "Services",
      "Free estimate",
    ],
    estimate: [
      "Estimates are free. Use the booking page to pick a date and get a written quote by email, or call or message us on WhatsApp and we will set up a visit.",
      "Book and get a quote",
      "Services",
      "Service areas",
    ],
    stamped: [
      "Stamped concrete is poured, colored and imprinted with a pattern, then sealed. See patterns and care tips on the Stamped and Decorative page.",
      "Free estimate",
      "Pricing",
    ],
  };
  function say(t, me) {
    var m = document.createElement("div");
    m.className = "msg" + (me ? " me" : "");
    m.textContent = t;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
  }
  function opts(list) {
    qr.innerHTML = "";
    list.forEach(function (t) {
      var b = document.createElement("button");
      b.textContent = t;
      b.onclick = function () {
        ask(t);
      };
      qr.appendChild(b);
    });
    var a = document.createElement("a");
    a.href = waLink(
      "Hi Snakes Concrete, I have a question.",
    );
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "Continue on WhatsApp";
    qr.appendChild(a);
  }
  function ask(t) {
    say(t, true);
    var k = {
      Services: "services",
      Pricing: "pricing",
      "Service areas": "areas",
      "Free estimate": "estimate",
      "Book and get a quote": "estimate",
      "Stamped concrete": "stamped",
    }[t];
    if (t === "Open quote calculator") {
      location.href =
        (document.body.getAttribute("data-root") || "") +
        "booking.html";
      return;
    }
    if (t === "Book and get a quote") {
      setTimeout(function () {
        location.href =
          (document.body.getAttribute("data-root") || "") +
          "booking.html";
      }, 600);
    }
    var r = KB[k];
    setTimeout(function () {
      say(r[0]);
      opts(r.slice(1));
    }, 350);
  }
  $(".bot", fab).addEventListener("click", function () {
    var o = chat.classList.toggle("open");
    this.setAttribute("aria-expanded", o);
    if (o && !opened) {
      opened = true;
      say(
        "Hi, I am the Snakes Concrete assistant. What can I help with?",
      );
      opts([
        "Services",
        "Pricing",
        "Service areas",
        "Stamped concrete",
        "Free estimate",
      ]);
    }
  });
  $("header button", chat).onclick = function () {
    chat.classList.remove("open");
    $(".bot", fab).setAttribute("aria-expanded", "false");
  };
})();
