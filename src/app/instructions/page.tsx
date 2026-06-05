"use client";

import { useState } from "react";
import { SyntheticBadge } from "@/components/SyntheticBadge";
import { Terminal, Copy, Check, FileCode2 } from "lucide-react";

const GENERATOR_SOURCE = `#!/usr/bin/env python3
"""
generate_synthetic.py - Dashlabs Synthetic Dataset Generator (engineered)
=========================================================================

Generates 13 FULLY SYNTHETIC healthcare-operations "clients" for the data
science internship portfolio. No real patient, physician, or client data is
read at runtime - every row is fabricated. The data is *engineered* so that
each of the nine portfolio projects produces a clean, interesting result:

  P1 Abnormal results .... abnormality driven by age + test + site (learnable)
  P2 Turnaround time ..... delays driven by weekday + hour + branch (learnable)
  P3 Segmentation ........ patients carry 5 distinct behavioral segments
  P4 Test bundles ........ panels are co-ordered (seeded association rules)
  P5 Revenue anomalies ... ~2.5% seeded discount/amount outliers
  P6 Ticket intelligence . 5 keyword-rich support-ticket categories (1 client)
  P7 SOAP NLP ............ soap_analytics notes across clinical topics (1 client)
  P8 Radiology parser .... multilingual word_value impressions (2 clients)
  P9 Cross-client bench .. 13 comparable clients with varied KPIs

Patient names/addresses are fabricated; ~1 in 5 is a pop-culture easter egg.
Safe to publish: corresponds to no real person or organization.

Usage:
  pip install pandas openpyxl numpy faker
  python generate_synthetic.py ./synthetic_out/
  python generate_synthetic.py ./synthetic_out/ --clients 13 --seed 42
"""

import os, sys, json, math, random, hashlib, argparse
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
from faker import Faker

# ---------------------------------------------------------------- THEMED POOLS
EASTER_NAMES = [
    "Sheldon Cooper", "Leonard Hofstadter", "Michael Scott", "Dwight Schrute",
    "Walter White", "Jesse Pinkman", "Tony Stark", "Bruce Wayne", "Clark Kent",
    "Monkey D. Luffy", "Roronoa Zoro", "Naruto Uzumaki", "Sasuke Uchiha",
    "Light Yagami", "Eren Yeager", "Mikasa Ackerman", "Saitama Sensei",
    "Edward Elric", "Spike Spiegel", "Goku Son", "Vegeta Briefs",
    "Hermione Granger", "Frodo Baggins", "Samwise Gamgee", "Geralt Rivia",
    "Rick Sanchez", "Morty Smith", "Eleven Hopper", "Daenerys Targaryen",
    "Jon Snow", "Tyrion Lannister", "Arya Stark", "Katniss Everdeen",
    "Peter Parker", "Diana Prince", "Steve Rogers", "Natasha Romanoff",
    "Ellie Williams", "Cloud Strife", "Tifa Lockhart", "Master Chief",
]
DIMENSION_ADDR = [
    "Bag End, Hobbiton, The Shire", "Konoha Village, Land of Fire",
    "Gotham City, NJ", "Hawkins, Indiana", "Soul Society, Seireitei",
    "Wakanda, East Africa", "Hogwarts Castle, Scotland", "Mordor, Mount Doom",
    "Pandora, Alpha Centauri", "Tatooine, Outer Rim", "Asgard, Nine Realms",
    "Night City, NC", "Rapture, Mid-Atlantic", "Midgar Sector 7",
    "The Upside Down", "Republic City", "Zion, Underground",
]

# ---------------------------------------------------------------- CLINICAL CATALOG
# unit/ref ranges are realistic; base_abn drives P1; tat_base (min) drives P2;
# panel tags drive P4 co-occurrence; lang flags Indonesian-named variants.
SERVICES = {
    "Complete Blood Count":      dict(lo=4.0, hi=11.0, unit="x10^9/L", base_abn=0.22, tat=55,  panel="routine", lang="en"),
    "Urinalysis":                dict(lo=1.005, hi=1.030, unit="SG",   base_abn=0.18, tat=45,  panel="routine", lang="en"),
    "Fasting Blood Sugar":       dict(lo=70.0, hi=100.0, unit="mg/dL", base_abn=0.34, tat=70,  panel="metabolic", lang="en"),
    "HbA1c":                     dict(lo=4.0, hi=5.7, unit="%",        base_abn=0.38, tat=90,  panel="metabolic", lang="en"),
    "Lipid Panel":               dict(lo=0.0, hi=200.0, unit="mg/dL",  base_abn=0.41, tat=85,  panel="metabolic", lang="en"),
    "Creatinine":                dict(lo=0.7, hi=1.3, unit="mg/dL",    base_abn=0.27, tat=75,  panel="renal", lang="en"),
    "BUN":                       dict(lo=7.0, hi=20.0, unit="mg/dL",   base_abn=0.25, tat=75,  panel="renal", lang="en"),
    "SGPT/ALT":                  dict(lo=7.0, hi=56.0, unit="U/L",     base_abn=0.30, tat=80,  panel="liver", lang="en"),
    "FT3":                       dict(lo=2.3, hi=4.2, unit="pg/mL",    base_abn=0.29, tat=120, panel="thyroid", lang="en"),
    "FT4":                       dict(lo=0.8, hi=1.8, unit="ng/dL",    base_abn=0.31, tat=120, panel="thyroid", lang="en"),
    "Hematologi":                dict(lo=4.0, hi=11.0, unit="x10^9/L", base_abn=0.24, tat=60,  panel="routine", lang="id"),
    "Kimia Klinik":              dict(lo=70.0, hi=110.0, unit="mg/dL", base_abn=0.36, tat=80,  panel="metabolic", lang="id"),
    "Urinalisis":                dict(lo=1.005, hi=1.030, unit="SG",   base_abn=0.19, tat=45,  panel="routine", lang="id"),
    "USG Abdomen":               dict(lo=None, hi=None, unit=None,     base_abn=0.0,  tat=240, panel="imaging", lang="id"),
    "Rontgen Dada":              dict(lo=None, hi=None, unit=None,     base_abn=0.0,  tat=210, panel="imaging", lang="id"),
    "Ultrasound":                dict(lo=None, hi=None, unit=None,     base_abn=0.0,  tat=240, panel="imaging", lang="en"),
    "ECG":                       dict(lo=None, hi=None, unit=None,     base_abn=0.0,  tat=40,  panel="cardio", lang="en"),
    "Consultation":              dict(lo=None, hi=None, unit=None,     base_abn=0.0,  tat=30,  panel="consult", lang="en"),
}
# per-service abnormality log-odds offset -> makes test type the dominant,
# learnable driver of P1 (with age secondary and site tertiary)
SERVICE_LOGIT = {
    "Complete Blood Count": -1.0, "Urinalysis": -1.2, "Hematologi": -0.9, "Urinalisis": -1.1,
    "Creatinine": -0.4, "BUN": -0.5, "FT3": -0.1, "FT4": 0.0, "SGPT/ALT": 0.2,
    "Fasting Blood Sugar": 0.5, "Kimia Klinik": 0.7, "HbA1c": 0.9, "Lipid Panel": 1.1,
}
PANELS = {
    "thyroid":   ["FT3", "FT4"],
    "metabolic": ["Fasting Blood Sugar", "Lipid Panel", "HbA1c"],
    "routine":   ["Complete Blood Count", "Urinalysis"],
    "renal":     ["BUN", "Creatinine"],
    "routine_id":["Hematologi", "Urinalisis"],
}

# ---------------------------------------------------------------- SEGMENTS (P3)
SEGMENTS = ["routine_monitor", "one_time", "corporate_ape", "senior_chronic", "sporadic"]
SEG_WEIGHTS = [0.26, 0.30, 0.12, 0.16, 0.16]

# ---------------------------------------------------------------- TICKETS (P6)
TICKET_CATS = {
    "machine_issue":   ["analyzer error", "machine offline", "calibration failed", "instrument not responding",
                        "LIS connection lost", "transmission error", "device timeout", "reagent jam"],
    "results_query":   ["result not showing", "wrong reference range", "missing result", "result correction needed",
                        "value discrepancy", "duplicate result", "result not released", "abnormal flag wrong"],
    "billing":         ["invoice discrepancy", "overcharged patient", "refund request", "payment not reflected",
                        "wrong discount applied", "receipt error", "double charge", "senior discount missing"],
    "product_setup":   ["add new test", "configure panel", "setup new branch", "onboard new service",
                        "create test bundle", "update price list", "new user training", "enable module"],
    "account_mgmt":    ["reset password", "add new user", "permission request", "deactivate account",
                        "role change", "access denied", "login issue", "update profile"],
}
TICKET_PRIORITIES = {"P1: Urgent. No workaround.": (3.7, 0.05),
                     "P2: Urgent. Workaround available.": (13.3, 0.25),
                     "P3: Normal.": (6.6, 0.70)}

# ---------------------------------------------------------------- SOAP (P7)
SOAP_TOPICS = {
    "respiratory":  "Patient presents with cough, colds, sore throat and low grade fever for {n} days. "
                    "No difficulty of breathing. Lungs clear on auscultation. Advised rest, hydration, paracetamol.",
    "hypertension": "Follow up for elevated blood pressure. BP {bp} on maintenance. Occasional headache and nape pain. "
                    "Continue losartan, advised low salt diet and regular monitoring.",
    "diabetes":     "Known diabetic for monitoring. Reports polyuria and easy fatigability. FBS elevated. "
                    "Continue metformin, reinforce diet and exercise, repeat HbA1c in 3 months.",
    "gastro":       "Complains of epigastric pain, nausea and loose stools for {n} days. Soft, non-tender abdomen. "
                    "Advised hydration, omeprazole, bland diet, return if persistent.",
    "musculoskel":  "Reports low back pain and joint pain after physical work. No trauma. Full range of motion. "
                    "Advised rest, NSAIDs, warm compress, physical therapy if no improvement.",
}
SOAP_SEVERITY = ["mild", "moderate", "severe"]

# ---------------------------------------------------------------- RADIOLOGY (P8)
RADIOLOGY_IMPRESSIONS = [
    ("normal", "Hepar normal, ginjal normal, vesica fellea normal. Tidak tampak kelainan."),
    ("normal", "Cor dan pulmo dalam batas normal. No active lung lesion."),
    ("normal", "USG abdomen dalam batas normal."),
    ("abnormal", "Hepatomegali ringan dengan fatty liver grade I."),
    ("abnormal", "Tampak efusi pleura minimal pada hemithorax kanan."),
    ("abnormal", "Cardiomegaly dengan CTR 0.58."),
    ("abnormal", "Nephrolithiasis pada ginjal kiri, ukuran 0.6 cm."),
    ("abnormal", "Cholelithiasis multiple pada vesica fellea."),
]

# ---------------------------------------------------------------- HELPERS
def hid(rng):
    return hashlib.sha256(("syn-" + str(rng.random())).encode()).hexdigest()[:12]

def make_name(rng, fake):
    return rng.choice(EASTER_NAMES) if rng.random() < 0.18 else fake.name()

def make_addr(rng, fake):
    return rng.choice(DIMENSION_ADDR) if rng.random() < 0.15 else fake.city()

def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-x))

# client-level multipliers give P1 a learnable "site" effect & P9 spread
def client_profiles(rng):
    profs = []
    for i in range(13):
        profs.append(dict(
            abn_offset=rng.uniform(-0.10, 0.18),     # site effect on abnormality
            tat_offset=rng.uniform(-20, 60),          # site effect on turnaround
            cancel=rng.uniform(0.02, 0.14),
            disc_rate=rng.uniform(0.10, 0.45),
            lang="id" if i in (1, 12) else "en",
        ))
    return profs

def weekday_mult(dt):
    return {0: 1.85, 1: 1.05, 2: 1.0, 3: 1.0, 4: 1.25, 5: 0.7, 6: 0.65}[dt.weekday()]

def hour_mult(h):
    return 1.55 if 10 <= h <= 11 else 1.3 if 8 <= h <= 12 else 0.85 if h < 8 else 1.0

# ---------------------------------------------------------------- GENERATE CLIENT
def gen_client(idx, prof, out_dir, rng, fake):
    label = "client_syn_{:02d}".format(idx + 1)
    lang = prof["lang"]
    base_day = datetime(2024, 9, 2)  # a Monday
    branches = ["Branch A", "Branch B", "Branch C", "Branch D"]
    branch_tat = {b: rng.uniform(-15, 70) for b in branches}

    svc_pool = [s for s, v in SERVICES.items()
                if (v["lang"] == lang or v["lang"] == "en" and lang == "en")]
    if lang == "id":
        svc_pool = [s for s in SERVICES if SERVICES[s]["lang"] in ("id",)] + ["Consultation", "ECG", "Ultrasound"]
    panel_keys = ["thyroid", "metabolic", "renal", ("routine_id" if lang == "id" else "routine")]

    n_pat = rng.randint(150, 260)
    patients, orders, items, svcs, results = [], [], [], [], []

    for _ in range(n_pat):
        pid = hid(rng)
        seg = rng.choices(SEGMENTS, weights=SEG_WEIGHTS, k=1)[0]
        if seg == "senior_chronic":
            age = int(np.clip(rng.gauss(66, 8), 45, 95))
        elif seg == "corporate_ape":
            age = int(np.clip(rng.gauss(38, 9), 20, 60))
        else:
            age = int(np.clip(rng.gauss(42, 16), 1, 95))
        sex = rng.choice(["Male", "Female"])
        patients.append(dict(_id=pid, patient_name=make_name(rng, fake), age=age, sex=sex,
                             civil_status=rng.choice(["Single", "Married", "Widowed", "Separated"]),
                             address=make_addr(rng, fake),
                             branch_ids=rng.choice(branches)))

        # number of visits by segment (drives P3 clustering)
        n_visits = {"routine_monitor": rng.randint(6, 12), "one_time": 1,
                    "corporate_ape": rng.randint(2, 4), "senior_chronic": rng.randint(4, 8),
                    "sporadic": rng.randint(2, 3)}[seg]

        for _v in range(n_visits):
            oid = hid(rng); branch = rng.choice(branches)
            created = base_day + timedelta(days=rng.randint(0, 150),
                                           hours=rng.randint(6, 18), minutes=rng.randint(0, 59))
            # choose services for this visit (panels drive P4 bundles)
            if seg == "corporate_ape" and rng.random() < 0.7:
                chosen = list(PANELS["metabolic"]) + (["Complete Blood Count"] if lang == "en" else ["Hematologi"])
            elif seg == "senior_chronic" and rng.random() < 0.6:
                chosen = ["HbA1c", "Lipid Panel"] if lang == "en" else ["Kimia Klinik"]
            elif rng.random() < 0.42:  # ~42% multi-test via a panel
                chosen = list(PANELS[rng.choice(panel_keys)])
            else:
                chosen = [rng.choice(svc_pool)]
            chosen = [c for c in chosen if c in SERVICES] or ["Consultation"]

            # order + anomalies (P5)
            amt = round(float(np.exp(rng.gauss(7.4, 0.5))), 2)
            disc = round(amt * (rng.uniform(0.05, 0.35) if rng.random() < prof["disc_rate"] else 0.0), 2)
            is_anom = rng.random() < 0.025
            if is_anom:
                if rng.random() < 0.5:
                    disc = round(amt * rng.uniform(0.80, 0.95), 2)   # absurd discount
                else:
                    amt = round(amt * rng.uniform(8, 15), 2)          # outlier amount
            orders.append(dict(_id=oid, org_id=label, patient_id=pid, branch_ids=branch,
                               total_amount=amt, total_discount=disc,
                               is_cancelled=1 if rng.random() < prof["cancel"] else 0,
                               created_at=created.strftime("%Y-%m-%d %H:%M:%S")))

            for sv in chosen:
                meta = SERVICES[sv]
                items.append(dict(_id=hid(rng), order_id=oid, patient_id=pid, product_name=sv,
                                  amount=round(amt / len(chosen), 2), discount=0.0))
                # turnaround (P2): site + weekday + hour + branch + service
                tat = (meta["tat"] * weekday_mult(created) * hour_mult(created.hour)
                       + branch_tat[branch] + prof["tat_offset"] + rng.gauss(0, 18))
                tat = max(5, tat)
                collected = created + timedelta(minutes=rng.randint(2, 25))
                locked = collected + timedelta(minutes=int(tat))
                psid = hid(rng)
                status = "COMPLETED" if rng.random() > 0.08 else rng.choice(["CANCELLED", "PENDING"])
                svcs.append(dict(_id=psid, patient_id=pid, order_id=oid, service_name=sv,
                                 status=status, created_at=created.strftime("%Y-%m-%d %H:%M:%S"),
                                 collected_at=collected.strftime("%Y-%m-%d %H:%M:%S"),
                                 locked_at=locked.strftime("%Y-%m-%d %H:%M:%S")))
                # results (P1): abnormality from age + service + site
                row = dict(_id=hid(rng), patient_service_id=psid, patient_id=pid, service_name=sv,
                           number_value=None, ref_range_min=None, ref_range_max=None,
                           unit=meta["unit"], word_value=None)
                if meta["lo"] is not None:
                    p = sigmoid(-1.15 + SERVICE_LOGIT.get(sv, 0.0)
                                + 0.050 * (age - 45) + 3.0 * prof["abn_offset"])
                    p = min(0.96, max(0.02, p))
                    lo, hi = meta["lo"], meta["hi"]
                    if rng.random() < p:
                        val = (lo - abs(rng.gauss(0, (hi - lo) * 0.25 + 0.1)) if rng.random() < 0.5
                               else hi + abs(rng.gauss(0, (hi - lo) * 0.35 + 0.1)))
                    else:
                        val = rng.uniform(lo, hi)
                    row.update(number_value=round(val, 2), ref_range_min=lo, ref_range_max=hi)
                elif sv in ("USG Abdomen", "Rontgen Dada", "Ultrasound"):
                    tag, txt = rng.choices(RADIOLOGY_IMPRESSIONS,
                                           weights=[3, 3, 3, 1.4, 1, 1, 0.8, 0.8], k=1)[0]
                    row["word_value"] = txt
                results.append(row)

    tables = {
        "patients": pd.DataFrame(patients),
        "orders": pd.DataFrame(orders),
        "order_items": pd.DataFrame(items),
        "patient_services": pd.DataFrame(svcs),
        "patient_service_results": pd.DataFrame(results),
    }

    # P6 support_tickets: one client only
    if idx == 2:
        tix = []
        for _ in range(rng.randint(420, 520)):
            cat = rng.choice(list(TICKET_CATS.keys()))
            kw = rng.choice(TICKET_CATS[cat])
            # ~12% of tickets borrow a phrase from another category -> realistic, non-perfect F1
            extra = (rng.choice(TICKET_CATS[rng.choice(list(TICKET_CATS))]) if rng.random() < 0.12
                     else rng.choice(TICKET_CATS[cat]))
            desc = "Client reported: {}. {}. Please assist and advise.".format(kw, extra)
            pr = rng.choices(list(TICKET_PRIORITIES.keys()),
                             weights=[TICKET_PRIORITIES[k][1] for k in TICKET_PRIORITIES], k=1)[0]
            med = TICKET_PRIORITIES[pr][0]
            raised = base_day + timedelta(days=rng.randint(0, 150), minutes=rng.randint(0, 1439))
            done = raised + timedelta(hours=max(0.2, rng.gauss(med, med * 0.6)))
            tix.append(dict(_id=hid(rng), org_id=label, category=cat, description=desc,
                            priority=pr, status=rng.choice(["COMPLETED", "IN PROGRESS", "BACKLOG"]),
                            raised_at=raised.strftime("%Y-%m-%d %H:%M:%S"),
                            completed_at=done.strftime("%Y-%m-%d %H:%M:%S")))
        tables["support_tickets"] = pd.DataFrame(tix)

    # P7 soap_analytics: one client only
    if idx == 10:
        notes = []
        pidpool = [p["_id"] for p in patients]
        for _ in range(rng.randint(380, 460)):
            topic = rng.choice(list(SOAP_TOPICS.keys()))
            sev = rng.choices(SOAP_SEVERITY, weights=[0.55, 0.32, 0.13], k=1)[0]
            txt = SOAP_TOPICS[topic].format(n=rng.randint(2, 7), bp="{}/{}".format(rng.randint(130, 170), rng.randint(85, 105)))
            if sev == "severe":
                txt += " Advised further work-up and specialist referral."
            notes.append(dict(_id=hid(rng), patient_id=rng.choice(pidpool),
                              note_type="SOAP", note_content=txt, topic_seed=topic,
                              severity_seed=sev,
                              created_at=(base_day + timedelta(days=rng.randint(0, 150))).strftime("%Y-%m-%d %H:%M:%S")))
        tables["soap_analytics"] = pd.DataFrame(notes)

    for name, df in tables.items():
        df.to_excel(os.path.join(out_dir, "{}_{}.xlsx".format(label, name)), index=False)
    return label, {k: len(v) for k, v in tables.items()}

# ---------------------------------------------------------------- MAIN
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out")
    ap.add_argument("--clients", type=int, default=13)
    ap.add_argument("--seed", type=int, default=42)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    rng = random.Random(a.seed); np.random.seed(a.seed)
    fake = Faker(); Faker.seed(a.seed)
    profs = client_profiles(rng)
    print("Dashlabs Synthetic Generator (engineered) - {} clients (seed {})".format(a.clients, a.seed))
    print("100% synthetic. No real data is read. Safe to publish.")
    print("-" * 60)
    for i in range(a.clients):
        label, counts = gen_client(i, profs[i], a.out, rng, fake)
        print("  {}: {}".format(label, counts))
    print("-" * 60)
    print("Done -> {}".format(a.out))

if __name__ == "__main__":
    main()
`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function onCopy() {
    navigator.clipboard.writeText(text).then(function done() {
      setCopied(true);
      setTimeout(function reset() { setCopied(false); }, 1800);
    });
  }
  return (
    <button
      onClick={onCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold bg-[#475175] text-white hover:bg-[#5A6486] transition-colors cursor-pointer"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy script"}
    </button>
  );
}

const produces = [
  { k: "13 synthetic sites", v: "client_syn_01 through client_syn_13, each a folder of Excel files." },
  { k: "6 tables", v: "patients, orders, order_items, patient_services, patient_service_results, plus support_tickets (site 03) and soap_analytics (site 11)." },
  { k: "Engineered signal", v: "Every project has a real, recoverable pattern built in — abnormal rates, turnaround spikes, visit segments, test bundles, and more." },
  { k: "Playful labels", v: "A fraction of patient names and addresses are pop-culture / fantasy easter eggs, so no row reads as a real person." },
];

export default function InstructionsPage() {
  return (
    <div>
      <div className="bg-[#1A1F35] relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C7AA50]" />
        <div className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 pt-20 pb-20">
          <p className="font-mono text-[11px] font-semibold tracking-[0.12em] text-[#8B95B8] uppercase mb-4">
            Instructions
          </p>
          <h1 className="text-[2.5rem] md:text-[3rem] font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-5">
            Generate the dataset yourself.
          </h1>
          <p className="text-[1.0625rem] text-[#8B95B8] max-w-[640px] leading-[1.7]">
            The entire dataset behind this site comes from one self-contained Python script. Run it and you get the same thirteen sites — no external data, no network, no secrets.
          </p>
        </div>
      </div>

      <SyntheticBadge variant="banner" />

      <div className="max-w-[900px] mx-auto px-8 md:px-12 lg:px-16 py-16 space-y-14">

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Terminal size={18} className="text-[#1566FF]" />
            <h2 className="text-[1.5rem] font-extrabold text-[#475175]">Quick start</h2>
          </div>
          <p className="text-[1rem] text-[#5A6173] leading-relaxed mb-5">
            Requires Python 3.9+ with <code className="font-mono text-[0.9rem] text-[#1566FF]">pandas</code>, <code className="font-mono text-[0.9rem] text-[#1566FF]">numpy</code>, <code className="font-mono text-[0.9rem] text-[#1566FF]">openpyxl</code>, and <code className="font-mono text-[0.9rem] text-[#1566FF]">faker</code>.
          </p>
          <div className="rounded-xl bg-[#1A1F35] p-5 font-mono text-[13px] text-[#D7DCEE] leading-relaxed overflow-x-auto">
            <p><span className="text-[#8B95B8]"># install dependencies</span></p>
            <p className="mb-3">pip install pandas numpy openpyxl faker</p>
            <p><span className="text-[#8B95B8]"># generate all 13 sites into ./synthetic-data</span></p>
            <p>python generate_synthetic.py ./synthetic-data</p>
            <p className="mb-3 text-[#8B95B8]">  # optional: --clients 13 --seed 42</p>
          </div>
        </section>

        <section>
          <h2 className="text-[1.5rem] font-extrabold text-[#475175] mb-5">What it produces</h2>
          <div className="space-y-3">
            {produces.map(function renderRow(p) {
              return (
                <div key={p.k} className="p-5 rounded-xl border border-[#E6E6E6] bg-white">
                  <p className="font-semibold text-[#1A1F35] text-[0.9375rem] mb-1">{p.k}</p>
                  <p className="text-[0.875rem] text-[#5A6173] leading-relaxed">{p.v}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FileCode2 size={18} className="text-[#1566FF]" />
              <h2 className="text-[1.5rem] font-extrabold text-[#475175]">generate_synthetic.py</h2>
            </div>
            <CopyButton text={GENERATOR_SOURCE} />
          </div>
          <p className="text-[1rem] text-[#5A6173] leading-relaxed mb-5">
            The complete generator. Distribution parameters are baked in; it reads no external data at runtime, which is why it is safe to publish and share.
          </p>
          <div className="rounded-xl border border-[#E6E6E6] bg-[#0F1322] overflow-hidden">
            <pre className="p-5 overflow-x-auto max-h-[640px] overflow-y-auto text-[12px] leading-[1.6] font-mono text-[#C9D3F0]">
              <code>{GENERATOR_SOURCE}</code>
            </pre>
          </div>
        </section>

      </div>
    </div>
  );
}
