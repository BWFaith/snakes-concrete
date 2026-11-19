/* Quote calculator + booking. Reads rates from config.js */
(function () {
  "use strict";
  var C = window.SNAKES,
    P = C.pricing,
    form = document.getElementById("quoteForm");
  if (!form) return;
  var $ = function (s, r) {
      return (r || document).querySelector(s);
    },
    $$ = function (s, r) {
      return Array.prototype.slice.call(
        (r || document).querySelectorAll(s),
      );
    };
  var money = function (n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  };
  function radios(el, name, obj, checked, fmt) {
    el.innerHTML = Object.keys(obj)
      .map(function (k, i) {
        var o = obj[k];
        return (
          '<label class="opt"><input type="radio" name="' +
          name +
          '" value="' +
          k +
          '"' +
          (k === checked ? " checked" : "") +
          "><div>" +
          o.label +
          "<small>" +
          (fmt ? fmt(o) : o.sub || "") +
          "</small></div></label>"
        );
      })
      .join("");
  }
  radios(
    $("#optService"),
    "service",
    P.services,
    "driveway",
  );
  radios($("#optFinish"), "finish", P.finish, "broom");
  $("#optExtras").innerHTML = Object.keys(P.extras)
    .map(function (k) {
      return (
        '<label class="opt"><input type="checkbox" name="extra" value="' +
        k +
        '"><div>' +
        P.extras[k].label +
        "</div></label>"
      );
    })
    .join("");
  $("#zone").innerHTML = Object.keys(P.zones)
    .map(function (k) {
      return (
        '<option value="' +
        k +
        '">' +
        P.zones[k].label +
        "</option>"
      );
    })
    .join("");

  var d = new Date();
  d.setDate(d.getDate() + 2);
  $("#date").min = d.toISOString().slice(0, 10);
  var state = null;
  (function () {
    var u = new URLSearchParams(location.search),
      s = u.get("service"),
      f = u.get("finish");
    if (s && P.services[s]) {
      var r = form.querySelector(
        "input[name=service][value=" + s + "]",
      );
      if (r) r.checked = true;
    }
    if (f && P.finish[f]) {
      var r2 = form.querySelector(
        "input[name=finish][value=" + f + "]",
      );
      if (r2) r2.checked = true;
    }
    if (u.get("len"))
      $("#len").value = parseFloat(u.get("len")) || "";
    if (u.get("wid"))
      $("#wid").value = parseFloat(u.get("wid")) || "";
    if (u.get("thk") && P.thickness[u.get("thk")])
      $("#thk").value = u.get("thk");
  })();

  function calc() {
    var v = new FormData(form),
      svc = P.services[v.get("service")],
      L = parseFloat(v.get("len")) || 0,
      W = parseFloat(v.get("wid")) || 0;
    var wall = !!svc.wall;
    $("#lenLbl").firstChild.textContent = wall
      ? "Wall length (ft) "
      : "Length (ft) ";
    $("#widLbl").firstChild.textContent = wall
      ? "Wall height (ft) "
      : "Width (ft) ";
    $("#thkWrap").style.display = wall ? "none" : "";
    $("#finishWrap").style.opacity = svc.fixedFinish
      ? 0.45
      : 1;
    $$("input[name=finish]").forEach(function (i) {
      i.disabled = !!svc.fixedFinish;
    });
    var area = L * W,
      lines = [];
    if (!area) {
      state = null;
      render(null);
      return;
    }
    var thk = wall ? 1 : P.thickness[v.get("thk")];
    var finishAdd = svc.fixedFinish
      ? 0
      : P.finish[v.get("finish")].add;
    var base = area * svc.rate * thk;
    lines.push([
      svc.label +
        ", " +
        Math.round(area).toLocaleString() +
        " sq ft" +
        (wall ? "" : " at " + v.get("thk") + " in"),
      base,
    ]);
    if (finishAdd)
      lines.push([
        P.finish[v.get("finish")].label,
        area * finishAdd,
      ]);
    var sub = base + area * finishAdd;
    v.getAll("extra").forEach(function (k) {
      var e = P.extras[k],
        a = area * e.rate;
      lines.push([e.label, a]);
      sub += a;
    });
    var steps = Math.max(0, parseInt(v.get("steps")) || 0);
    if (steps) {
      lines.push([
        steps + " concrete step" + (steps > 1 ? "s" : ""),
        steps * P.stepRate,
      ]);
      sub += steps * P.stepRate;
    }
    var z = P.zones[v.get("zone")];
    if (z.mult !== 1) {
      var zc = sub * (z.mult - 1);
      lines.push([
        "Travel to " + z.label.split(",")[0],
        zc,
      ]);
      sub += zc;
    }
    var min = false;
    if (sub < P.minimumJob) {
      sub = P.minimumJob;
      min = true;
      lines.push(["Minimum job adjustment", 0]);
    }
    var lo = Math.round((sub * P.rangeLow) / 10) * 10,
      hi = Math.round((sub * P.rangeHigh) / 10) * 10;
    state = {
      svc: svc,
      area: area,
      lines: lines,
      lo: lo,
      hi: hi,
      L: L,
      W: W,
      wall: wall,
      thk: v.get("thk"),
      finish: svc.fixedFinish
        ? "Included"
        : P.finish[v.get("finish")].label,
      zone: z.label,
      min: min,
    };
    render(state);
  }
  function render(s) {
    var box = $("#sumBody");
    if (!s) {
      box.innerHTML =
        '<p class="empty">Enter the length and width of your project to see your estimate.</p>';
      $("#sumTot").textContent = "$0";
      return;
    }
    $("#sumTot").textContent =
      money(s.lo) + " to " + money(s.hi);
    box.innerHTML =
      "<ul>" +
      s.lines
        .map(function (l) {
          return (
            "<li><span>" +
            l[0] +
            "</span><span>" +
            (l[1] ? money(l[1]) : "") +
            "</span></li>"
          );
        })
        .join("") +
      "</ul>";
  }
  form.addEventListener("input", calc);
  form.addEventListener("change", calc);
  calc();

  function textSummary(q, v) {
    return q.lines
      .map(function (l) {
        return (
          "- " + l[0] + (l[1] ? ": " + money(l[1]) : "")
        );
      })
      .join("\n");
  }
  function htmlSummary(q) {
    return (
      '<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' +
      q.lines
        .map(function (l) {
          return (
            '<tr><td style="padding:8px 0;border-bottom:1px solid #ddd">' +
            l[0] +
            '</td><td style="padding:8px 0;border-bottom:1px solid #ddd;text-align:right">' +
            (l[1] ? money(l[1]) : "") +
            "</td></tr>"
          );
        })
        .join("") +
      '<tr><td style="padding:12px 0;font-weight:bold">Estimated range</td><td style="padding:12px 0;font-weight:bold;text-align:right">' +
      money(q.lo) +
      " to " +
      money(q.hi) +
      "</td></tr></table>"
    );
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("#qErr");
    err.textContent = "";
    if (!state) {
      err.textContent =
        "Add the length and width of your project first so we can calculate your estimate.";
      $("#len").focus();
      return;
    }
    var v = new FormData(form);
    if (v.get("website")) return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var now = new Date(),
      qn =
        "SC-" +
        String(now.getFullYear()).slice(2) +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        "-" +
        Math.floor(1000 + Math.random() * 9000);
    var dt = new Date(
      v.get("date") + "T12:00:00",
    ).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    var params = {
      quote_number: qn,
      customer_name: v.get("name"),
      customer_email: v.get("email"),
      customer_phone: v.get("phone"),
      address: v.get("address"),
      service: state.svc.label,
      size:
        Math.round(state.area) +
        " sq ft (" +
        state.L +
        " x " +
        state.W +
        " ft)",
      finish: state.finish,
      zone: state.zone,
      estimate_low: money(state.lo),
      estimate_high: money(state.hi),
      preferred_date: dt,
      time_window: v.get("window"),
      start_timeline: v.get("timeline"),
      notes: v.get("notes") || "None",
      breakdown_text: textSummary(state),
      breakdown_html: htmlSummary(state),
      subject:
        "New quote and booking " +
        qn +
        " from " +
        v.get("name"),
    };
    var btn = $("#qSubmit");
    btn.disabled = true;
    btn.textContent = "Sending your quote…";
    window
      .sendEmails(params, { customer: true })
      .then(function () {
        done(params, true);
      })
      .catch(function () {
        done(params, false);
      });
  });

  function done(p, sent) {
    var out = $("#qDone");
    var body =
      "New quote and booking request " +
      p.quote_number +
      "\n\nName: " +
      p.customer_name +
      "\nPhone: " +
      p.customer_phone +
      "\nEmail: " +
      p.customer_email +
      "\nSite address: " +
      p.address +
      "\n\nService: " +
      p.service +
      "\nSize: " +
      p.size +
      "\nFinish: " +
      p.finish +
      "\n\n" +
      p.breakdown_text +
      "\n\nEstimated range: " +
      p.estimate_low +
      " to " +
      p.estimate_high +
      "\n\nPreferred date: " +
      p.preferred_date +
      " (" +
      p.time_window +
      ")\nStart: " +
      p.start_timeline +
      "\nNotes: " +
      p.notes;
    var html =
      "<h2>" +
      (sent ? "Your quote is booked" : "One last step") +
      '</h2><p class="lead">Quote number <b>' +
      p.quote_number +
      "</b></p>";
    html += sent
      ? '<div class="ok-box">We emailed your quote to ' +
        p.customer_email +
        " and sent a copy to our team. We will confirm your " +
        p.preferred_date +
        " visit by phone or text.</div>"
      : '<div class="warn-box">Online email sending is not switched on for this site yet. Tap the button to send your quote from your own email app. Nothing is booked until we receive it, or call us on <a href="tel:+1' +
        C.phone.replace(/\D/g, "") +
        '">' +
        C.phone +
        '</a>.</div><p style="margin-top:18px"><a class="btn btn-primary" href="mailto:' +
        C.email +
        "?cc=" +
        encodeURIComponent(p.customer_email) +
        "&subject=" +
        encodeURIComponent(p.subject) +
        "&body=" +
        encodeURIComponent(body) +
        '">Send quote from my email app</a></p>';
    html +=
      '<div class="panel" style="margin-top:24px"><h3>' +
      p.service +
      ": " +
      p.estimate_low +
      " to " +
      p.estimate_high +
      "</h3><div>" +
      p.breakdown_html +
      '</div><p style="margin-top:14px;font-size:.92rem;color:#555d6b">This is an estimate based on the details you entered. A free site visit confirms the final price, and we will never start work without your written approval.</p></div>';
    html +=
      '<p class="btn-row no-print" style="margin-top:22px"><button class="btn btn-blue" onclick="window.print()">Print or save as PDF</button><a class="btn btn-line" href="index.html">Back to home</a></p>';
    out.innerHTML = html;
    out.hidden = false;
    form.hidden = true;
    $("#qSide").hidden = true;
    out.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
})();
