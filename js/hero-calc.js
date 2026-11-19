/* Hero step-by-step estimate. Uses the same rates as the booking page (config.js). */
(function () {
  "use strict";
  var box = document.getElementById("hcalc");
  if (!box) return;
  var P = window.SNAKES.pricing,
    $ = function (s, r) {
      return (r || box).querySelector(s);
    },
    $$ = function (s) {
      return Array.prototype.slice.call(
        box.querySelectorAll(s),
      );
    };
  var st = { svc: null, fin: "broom", step: 1 },
    money = function (n) {
      return "$" + Math.round(n).toLocaleString("en-US");
    };
  var keys = [
    "driveway",
    "patio",
    "walkway",
    "slab",
    "foundation",
    "stamped",
  ];
  $("#hcService").innerHTML = keys
    .map(function (k) {
      return (
        '<button type="button" class="hc-opt" data-k="' +
        k +
        '">' +
        P.services[k].label +
        "<small>" +
        P.services[k].sub +
        "</small></button>"
      );
    })
    .join("");
  $("#hcFinish").innerHTML = Object.keys(P.finish)
    .map(function (k) {
      return (
        '<button type="button" class="hc-opt" data-f="' +
        k +
        '">' +
        P.finish[k].label +
        "<small>" +
        P.finish[k].sub +
        "</small></button>"
      );
    })
    .join("");
  function go(n) {
    st.step = n;
    $$(".hc-panel").forEach(function (p) {
      p.hidden = String(n) !== p.getAttribute("data-s");
    });
    var shown = Math.min(n, 3);
    $("#hcStep").textContent =
      n === 4 ? "Done" : "Step " + n + " of 3";
    $$(".hc-bar i").forEach(function (b, i) {
      b.className = n === 4 || i < shown ? "on" : "";
    });
  }
  function result() {
    var s = P.services[st.svc],
      L = parseFloat($("#hcLen").value),
      W = parseFloat($("#hcWid").value),
      area = L * W;
    var thk = s.wall ? 1 : P.thickness[$("#hcThk").value],
      add = s.fixedFinish ? 0 : P.finish[st.fin].add;
    var sub = Math.max(
      P.minimumJob,
      area * s.rate * thk + area * add,
    );
    $("#hcTotal").textContent =
      money(Math.round((sub * P.rangeLow) / 10) * 10) +
      " to " +
      money(Math.round((sub * P.rangeHigh) / 10) * 10);
    $("#hcSum").textContent =
      s.label +
      ", " +
      Math.round(area).toLocaleString() +
      " sq ft" +
      (s.fixedFinish
        ? ""
        : ", " + P.finish[st.fin].label.toLowerCase()) +
      ".";
    $("#hcBook").href =
      "booking.html?service=" +
      st.svc +
      "&len=" +
      L +
      "&wid=" +
      W +
      "&thk=" +
      $("#hcThk").value +
      "&finish=" +
      st.fin +
      "#quoteForm";
    go(4);
  }
  $$("#hcService .hc-opt").forEach(function (b) {
    b.onclick = function () {
      st.svc = b.getAttribute("data-k");
      $$("#hcService .hc-opt").forEach(function (x) {
        x.classList.toggle("sel", x === b);
      });
      go(2);
      $("#hcLen").focus({ preventScroll: true });
    };
  });
  $("#hcToFinish").onclick = function () {
    var L = parseFloat($("#hcLen").value),
      W = parseFloat($("#hcWid").value),
      e = $("#hcErr");
    if (!(L > 0 && W > 0)) {
      e.textContent = "Enter the length and width in feet.";
      return;
    }
    e.textContent = "";
    if (P.services[st.svc].fixedFinish) result();
    else go(3);
  };
  $$("#hcFinish .hc-opt").forEach(function (b) {
    b.onclick = function () {
      st.fin = b.getAttribute("data-f");
      $$("#hcFinish .hc-opt").forEach(function (x) {
        x.classList.toggle("sel", x === b);
      });
      result();
    };
  });
  $$("[data-back]").forEach(function (b) {
    b.onclick = function () {
      go(st.step - 1);
    };
  });
  $("#hcReset").onclick = function () {
    go(1);
  };
  [$("#hcLen"), $("#hcWid")].forEach(function (i) {
    i.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        $("#hcToFinish").click();
      }
    });
  });
})();
