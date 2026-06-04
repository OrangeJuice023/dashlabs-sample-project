export interface ProjectDetail {
  businessProblem: {
    headline: string;
    paragraphs: string[];
    cards: { label: string; value: string }[];
  };
  dataSources: {
    headline: string;
    description: string;
    tables: {
      name: string;
      fields: string[];
      note: string;
      primary?: boolean;
    }[];
  };
  methodology: {
    headline: string;
    description: string;
    steps: { step: string; title: string; desc: string }[];
  };
  analysis: {
    headline: string;
    description: string;
    kpis: { value: string; label: string; sub: string; color: string }[];
    charts: { title: string; subtitle: string; data?: { label: string; value: number; n?: number }[] }[];
  };
  insights: {
    headline: string;
    items: { title: string; desc: string }[];
  };
  future: {
    headline: string;
    items: { title: string; desc: string }[];
  };
}

export const projectDetails: Record<string, ProjectDetail> = {

  "01-abnormal-results": {
    businessProblem: {
      headline: "Can we predict an abnormal lab result from what we know at registration?",
      paragraphs: [
        "Abnormal results are only identified after the analyzer transmits a value and a technician compares it to the reference range. We asked whether abnormality can be anticipated earlier, from features known at registration: patient age, sex, the service ordered, and the client.",
        "The honest answer from the data is: weakly. This page reports the real result — including a modest AUC — rather than an inflated one, because an over-perfect classifier on this feature set would be a red flag, not a win.",
      ],
      cards: [
        { label: "Problem Type", value: "Binary Classification" },
        { label: "Target Variable", value: "is_abnormal (0 / 1)" },
        { label: "Honest Result", value: "AUC-ROC ~0.61" },
      ],
    },
    dataSources: {
      headline: "Six clients with usable lab result values and reference ranges.",
      description: "Built on anonymized patient_service_results joined to patient demographics. Only rows with both a numeric value and a valid reference range can be labeled — that turned out to be a minority of rows, which is itself a finding.",
      tables: [
        { name: "patient_service_results", fields: ["number_value", "ref_range_min", "ref_range_max", "service_name"], note: "Labeling source: abnormal = value outside range", primary: true },
        { name: "patients", fields: ["age", "sex"], note: "Demographic features, joined on patient_id" },
        { name: "patient_services", fields: ["service_name", "status"], note: "Service context" },
      ],
    },
    methodology: {
      headline: "Label from reference ranges, then model honestly.",
      description: "No SMOTE, no leakage, no tuning to chase a number. Class imbalance is handled with balanced class weights and the result is reported as-is.",
      steps: [
        { step: "01", title: "Label Generation", desc: "is_abnormal = 1 when number_value falls outside [ref_range_min, ref_range_max]. Rows missing a value or a valid range are excluded." },
        { step: "02", title: "Coverage Check", desc: "Only ~16% of result rows (801 of ~5,000) had both a numeric value and a usable range. Low coverage is reported, not hidden." },
        { step: "03", title: "Feature Join", desc: "Age and sex joined from the patients table on hashed patient_id; service_name and client retained as categoricals." },
        { step: "04", title: "Model Training", desc: "Logistic Regression and Random Forest, one-hot encoded categoricals, balanced class weights." },
        { step: "05", title: "Validation", desc: "5-fold stratified cross-validation, AUC-ROC as the primary metric. Reported with standard deviation across folds." },
      ],
    },
    analysis: {
      headline: "Real results: service type matters, demographics barely.",
      description: "All figures below are computed from the anonymized data — 801 labeled results across 8 clients.",
      kpis: [
        { value: "0.61", label: "AUC-ROC", sub: "Random Forest, 5-fold CV", color: "#1566FF" },
        { value: "30.2%", label: "Abnormal Rate", sub: "Pooled, 801 labeled rows", color: "#C7AA50" },
        { value: "16%", label: "Label Coverage", sub: "Rows with value + valid range", color: "#C0392B" },
        { value: "8", label: "Clients", sub: "With usable results", color: "#475175" },
      ],
      charts: [
        { title: "Abnormal Rate by Service Type", subtitle: "Percent of results flagged abnormal — services with n>=20", data: [
          { label: "Clinical Chemistry", value: 41.1, n: 146 },
          { label: "Kimia Klinik", value: 36.7, n: 30 },
          { label: "Hematologi", value: 32.6, n: 135 },
          { label: "Hematology", value: 25.7, n: 452 },
        ] },
      ],
    },
    insights: {
      headline: "What the real numbers say.",
      items: [
        { title: "Predictability is modest, and that's the honest headline", desc: "AUC-ROC of ~0.61 means age, sex, service, and client only weakly predict abnormality. A higher number on this feature set would suggest leakage, not skill." },
        { title: "Service type is the strongest signal", desc: "Clinical Chemistry results are abnormal 41% of the time versus 26% for Hematology — the kind of operational pattern worth acting on." },
        { title: "Only 16% of results were labelable", desc: "Just 801 of ~5,000 result rows had both a numeric value and a valid reference range. Reference-range data quality is the real bottleneck for any production version." },
        { title: "Multilingual schema is real", desc: "Indonesian service names (Hematologi, Kimia Klinik) sit alongside English ones, reflecting genuine cross-client data — and a real normalization challenge." },
      ],
    },
    future: {
      headline: "What would actually move the needle.",
      items: [
        { title: "Fix reference-range coverage first", desc: "The 20% labelable rate caps everything downstream. Cleaning and completing reference ranges matters more than any model change." },
        { title: "Richer features", desc: "Collection time, prior-result history, and ordering context are likely far more predictive than static demographics." },
        { title: "Service-specific models", desc: "Given how much service type drives the signal, per-service-category models would likely beat one global model." },
        { title: "Standardize service naming", desc: "Map multilingual and per-client service names to a shared taxonomy before pooling." },
      ],
    },
  },

  "02-turnaround-time": {
    businessProblem: {
      headline: "How long do lab results actually take — and can the network even measure it?",
      paragraphs: [
        "Turnaround time (TAT) drives patient experience and SLA compliance. The intended project was a TAT predictor; the data forced a more honest, and arguably more useful, first question: can these labs measure turnaround at all?",
        "The answer is mostly no. Only 3 of 13 clients populate the collection timestamp needed to compute true TAT. This page reports real TAT for those three and treats the measurement gap itself as the headline finding.",
      ],
      cards: [
        { label: "Problem Type", value: "Operational Timing Analysis" },
        { label: "Measurable Clients", value: "3 of 13" },
        { label: "Honest Finding", value: "TAT instrumentation gap" },
      ],
    },
    dataSources: {
      headline: "Collection-to-lock timestamps — where they exist.",
      description: "TAT = locked_at - collected_at. collected_at is populated for only upcare, rg, and healthway; the other 10 clients leave it blank, so they cannot be measured.",
      tables: [
        { name: "patient_services", fields: ["collected_at", "locked_at", "service_name", "status"], note: "Timestamps define TAT — sparsely populated", primary: true },
      ],
    },
    methodology: {
      headline: "Measure what is measurable, report the rest as a gap.",
      description: "No model is fit — with three clients and heavy skew, an honest distribution beats a fragile predictor.",
      steps: [
        { step: "01", title: "Coverage Audit", desc: "Check collected_at population across all 13 clients. Only 3 have usable coverage (32-73%); the rest are near 0%." },
        { step: "02", title: "TAT Calculation", desc: "turnaround_minutes = locked_at - collected_at, keeping values between 0 and 7 days." },
        { step: "03", title: "Per-Client Medians", desc: "Report median TAT per measurable client; medians resist the heavy right tail." },
        { step: "04", title: "Honest Caveat", desc: "locked_at may reflect batch data-entry rather than true completion, which inflates the tail (mean >> median)." },
      ],
    },
    analysis: {
      headline: "Real TAT for the three clients that capture it.",
      description: "496 services with valid collection and lock timestamps across upcare, rg, and healthway. Medians shown; the network-wide gap is the bigger story.",
      kpis: [
        { value: "3 / 13", label: "Clients Measurable", sub: "Others lack collected_at", color: "#C0392B" },
        { value: "194m", label: "Pooled Median TAT", sub: "~3.2 hours, 496 services", color: "#1566FF" },
        { value: "17x", label: "Spread Across Labs", sub: "21 min vs 366 min median", color: "#C7AA50" },
        { value: "496", label: "Services Timed", sub: "Valid collect-to-lock pairs", color: "#475175" },
      ],
      charts: [
        { title: "Median Turnaround Time by Client", subtitle: "Minutes, the 3 clients that record collection timestamps", data: [
          { label: "upcare", value: 366, n: 147 },
          { label: "rg", value: 122, n: 272 },
          { label: "healthway", value: 21, n: 77 },
        ] },
      ],
    },
    insights: {
      headline: "What the timing data shows.",
      items: [
        { title: "Most of the network cannot measure TAT at all", desc: "10 of 13 clients leave collected_at blank. Before any TAT prediction is possible, collection-time capture has to be fixed operationally — that is the real first deliverable." },
        { title: "TAT varies ~17x across the measurable labs", desc: "Median ranges from 21 minutes (healthway) to 366 minutes (upcare). Whether that reflects real speed or different timestamping habits needs validation." },
        { title: "Mean far exceeds median", desc: "Pooled mean (~1,037 min) dwarfs the median (194 min), a classic heavy right tail — likely end-of-shift batch locking rather than genuine multi-day turnaround." },
        { title: "Limitation: locked_at is a proxy", desc: "Without a true result-released timestamp, lock time is the best available end point, and it overstates real processing time." },
      ],
    },
    future: {
      headline: "From measurement gap to predictor.",
      items: [
        { title: "Fix collection-time capture first", desc: "A TAT predictor is only possible once more than 3 labs record collected_at. That is an operations change, not a modeling one." },
        { title: "Add a released_at timestamp", desc: "A true completion marker would replace the noisy locked_at proxy and tighten every metric." },
        { title: "Per-client SLA baselines", desc: "Once coverage improves, set per-client expected windows and flag breaches in real time." },
        { title: "Then model it", desc: "With clean timestamps and volume features, the original regression predictor becomes viable." },
      ],
    },
  },

  "03-patient-segmentation": {
    businessProblem: {
      headline: "Patient segmentation — limited by available data.",
      paragraphs: [
        "This project clusters patients into behavioral segments from visit frequency, spend, and service mix. It requires linked patient visit history.",
        "On the current 500-row-per-table samples, patients barely link to orders — effectively no patient has more than one recorded visit — so there is nothing meaningful to cluster. The project is parked until full (non-sample) patient history is available.",
      ],
      cards: [
        { label: "Status", value: "Limited Data" },
        { label: "Blocker", value: "Sampled tables, no visit history" },
        { label: "Planned Method", value: "K-Means + PCA" },
      ],
    },
    dataSources: {
      headline: "Needs full patient transaction history.",
      description: "Requires patients joined to their complete orders and services. Sample caps break the join — most patients have zero linked orders in the sample.",
      tables: [
        { name: "patients", fields: ["age", "sex"], note: "Demographics", primary: true },
        { name: "orders", fields: ["total_amount", "created_at"], note: "Needs full history, not a 500-row sample" },
      ],
    },
    methodology: {
      headline: "Planned approach (not viable on samples).",
      description: "Documented as intent. Running it on the sample produced a degenerate single-cluster result, which is not reported as a finding.",
      steps: [
        { step: "01", title: "Feature Aggregation", desc: "Per-patient visits, spend, unique services, recency." },
        { step: "02", title: "Scale + Cluster", desc: "StandardScaler then K-Means, K chosen by silhouette." },
        { step: "03", title: "Profile Segments", desc: "Label clusters by behavior once real history exists." },
      ],
    },
    analysis: {
      headline: "No valid results on sampled data.",
      description: "Clustering the sample yields one dominant blob plus tiny outlier groups — an artifact of missing visit history, not real segments. Held until full data is available.",
      kpis: [
        { value: "—", label: "Pending", sub: "Needs full patient history", color: "#8B95B8" },
      ],
      charts: [],
    },
    insights: {
      headline: "Why it is parked.",
      items: [
        { title: "Samples lack the signal", desc: "With 0% of sampled patients showing 2+ visits, frequency and recency features are empty — segmentation has nothing to separate on." },
      ],
    },
    future: {
      headline: "Next step.",
      items: [
        { title: "Pull full patient history", desc: "Replace the 500-row samples with complete per-patient orders and services, then rerun the clustering pipeline." },
      ],
    },
  },

  "04-test-bundles": {
    businessProblem: {
      headline: "Which tests are actually ordered together — and is there even much bundling to find?",
      paragraphs: [
        "Labs design bundled packages by intuition. Market-basket analysis on real order data shows which tests genuinely co-occur, so packages can match real ordering behavior instead of guesswork.",
        "The first honest finding reframes the question: across 2,677 anonymized orders, only about 10% contain two or more distinct tests. Bundling opportunity is real but concentrated, not pervasive — which itself is useful to know before designing packages.",
      ],
      cards: [
        { label: "Problem Type", value: "Association Rule Mining" },
        { label: "Method", value: "Co-occurrence + lift" },
        { label: "Orders Analyzed", value: "2,677" },
      ],
    },
    dataSources: {
      headline: "Order-level baskets pooled across all clients.",
      description: "Each order_id becomes a basket of the distinct products it contains. Pairs are scored by support, confidence, and lift; only pairs seen at least 10 times are kept.",
      tables: [
        { name: "order_items", fields: ["order_id", "product_name"], note: "Transaction-level baskets", primary: true },
        { name: "patient_services", fields: ["service_name"], note: "Service-name cross-reference" },
      ],
    },
    methodology: {
      headline: "Baskets, co-occurrence, lift.",
      description: "Classic market-basket analysis, kept honest with a minimum-count floor so rare coincidences do not masquerade as rules.",
      steps: [
        { step: "01", title: "Basket Construction", desc: "Group order_items by order_id; each basket is the set of distinct items in that order." },
        { step: "02", title: "Pair Counting", desc: "Count every co-occurring item pair across 2,677 pooled orders." },
        { step: "03", title: "Scoring", desc: "Support, confidence, and lift per pair. Lift > 1 means the pair co-occurs more than chance." },
        { step: "04", title: "Floor", desc: "Keep only pairs seen at least 10 times to avoid spurious high-lift coincidences from tiny counts." },
        { step: "05", title: "Clinical Read", desc: "Sanity-check surviving pairs against known panels (thyroid, metabolic, renal)." },
      ],
    },
    analysis: {
      headline: "Real co-occurrence: clinically sensible, but sparse.",
      description: "Computed across 2,677 pooled orders. Most orders are single-test; the strong pairs that exist line up with real clinical panels.",
      kpis: [
        { value: "10%", label: "Multi-Test Orders", sub: "Have 2+ distinct items", color: "#C0392B" },
        { value: "18", label: "Pairs, Lift > 1.5", sub: "Min 10 co-occurrences", color: "#1566FF" },
        { value: "100%", label: "Top Confidence", sub: "FT3 then FT4 (thyroid)", color: "#27AE60" },
        { value: "2,677", label: "Orders Analyzed", sub: "Pooled, all clients", color: "#475175" },
      ],
      charts: [
        { title: "Top Co-Occurring Test Pairs by Confidence", subtitle: "How often the second test follows the first in the same order (min 10 co-occurrences)", data: [
          { label: "FT3 + FT4", value: 100, n: 13 },
          { label: "CHEM 10 + HbA1c", value: 52, n: 23 },
          { label: "Creatinine + HbA1c", value: 50, n: 11 },
          { label: "BUN + Creatinine", value: 27, n: 12 },
          { label: "Basic 5 + ECG", value: 25, n: 14 },
        ] },
      ],
    },
    insights: {
      headline: "What the baskets reveal.",
      items: [
        { title: "Most orders are single-test", desc: "Only ~10% of 2,677 orders contain two or more distinct tests. Bundling is a targeted opportunity, not a network-wide pattern — worth saying before anyone designs ten new packages." },
        { title: "Thyroid panel is the cleanest bundle", desc: "FT3 and FT4 co-occur with 100% confidence — when one appears, so does the other. An obvious candidate for a single thyroid package." },
        { title: "A metabolic cluster is real", desc: "CHEM 10, HbA1c, Creatinine, and BUN co-occur well above chance — the data-driven version of a metabolic / diabetic monitoring panel." },
        { title: "Limitation: co-occurrence is not clinical advice", desc: "Lift shows ordering habits, not medical necessity. Any package should be validated by a physician, and sparse multi-test rates mean some rules rest on only a few dozen orders." },
      ],
    },
    future: {
      headline: "From discovery to packages.",
      items: [
        { title: "Checkout suggestions", desc: "When FT3 is ordered, suggest FT4 — the 100%-confidence pair is a safe default prompt." },
        { title: "Validate the metabolic panel", desc: "Take the CHEM 10 / HbA1c / Creatinine cluster to a physician to confirm a real package." },
        { title: "Per-client baskets", desc: "Bundling differs by client and case mix; rerun per client once full (non-sample) orders are available." },
        { title: "Triplet rules", desc: "Extend from pairs to 3-item itemsets to find full-panel patterns, given enough volume." },
      ],
    },
  },

  "05-revenue-anomalies": {
    businessProblem: {
      headline: "Are there unusual discount or revenue patterns worth an operational look?",
      paragraphs: [
        "Discounts, voids, and cancellations are routine, but outliers can signal errors or policy drift. This project flags statistically unusual orders for audit.",
        "The honest result is that, on this data, anomalies are rare and the signal is thin: most orders carry no discount at all, so there is little for a detector to catch. That is a finding in itself.",
      ],
      cards: [
        { label: "Problem Type", value: "Anomaly Detection" },
        { label: "Method", value: "Isolation Forest + Z-score" },
        { label: "Honest Caveat", value: "Sparse + jittered amounts" },
      ],
    },
    dataSources: {
      headline: "Order-level financials across clients.",
      description: "Amounts are jittered +/-15% by the anonymizer, so distributions are preserved but exact thresholds are blurred. Discount ratio = total_discount / total_amount.",
      tables: [
        { name: "orders", fields: ["total_amount", "total_discount", "is_cancelled"], note: "Transaction-level financials (jittered)", primary: true },
      ],
    },
    methodology: {
      headline: "Two detectors, agreement required.",
      description: "Statistical and ML detectors are combined; only orders both flag are treated as strong anomalies.",
      steps: [
        { step: "01", title: "Feature Build", desc: "Per order: amount and discount-to-total ratio (clipped to 0-100%)." },
        { step: "02", title: "Z-score Detection", desc: "Flag orders whose discount ratio exceeds 3 standard deviations from the mean." },
        { step: "03", title: "Isolation Forest", desc: "Unsupervised detector with contamination set to 2%." },
        { step: "04", title: "Agreement", desc: "Report where both methods agree to suppress false positives." },
      ],
    },
    analysis: {
      headline: "Anomalies are rare and the data is thin.",
      description: "418 orders with valid amounts. Most carry no discount, so the detectors find little — which is the honest takeaway.",
      kpis: [
        { value: "2.2%", label: "Flagged (Isolation Forest)", sub: "~9 of 418 orders", color: "#C0392B" },
        { value: "5%", label: "Orders With Any Discount", sub: "95% carry none", color: "#C7AA50" },
        { value: "26%", label: "Mean Discount Ratio", sub: "Among discounted orders", color: "#1566FF" },
        { value: "1", label: "Both Methods Agree", sub: "Strict-consensus anomaly", color: "#475175" },
      ],
      charts: [],
    },
    insights: {
      headline: "What the detector did and did not find.",
      items: [
        { title: "Discounts are uncommon here", desc: "Only ~5% of 418 orders carry any discount at all, so there is little anomalous behavior for a detector to surface." },
        { title: "Methods rarely agree", desc: "Isolation Forest flags ~2.2% and the Z-score test 0.2%; they agree on a single order. Honest anomaly detection often produces few confident hits, not a dramatic list." },
        { title: "One genuine high-discount order", desc: "Exactly one order exceeds a 50% discount ratio — the kind of single case a finance review would actually want to see." },
        { title: "Limitation: jitter + volume", desc: "Amounts are jittered +/-15% and the sample is small, so this demonstrates the method rather than auditing real money. Full, un-jittered data would sharpen it." },
      ],
    },
    future: {
      headline: "From detection to prevention.",
      items: [
        { title: "Run on full, un-jittered amounts", desc: "Real figures and full volume would make thresholds precise enough for an actual audit." },
        { title: "Cashier and branch profiling", desc: "Track void and discount rates per cashier and branch to find systematic patterns rather than one-off orders." },
        { title: "Point-of-sale alerts", desc: "Flag unusual transactions live instead of in a monthly report." },
        { title: "Seasonal baselines", desc: "Discount norms shift during corporate (APE) season; baselines should adapt." },
      ],
    },
  },

  "06-ticket-intelligence": {
    businessProblem: {
      headline: "What do support tickets reveal about triage and resolution speed?",
      paragraphs: [
        "The CS team handles a steady ticket volume with manual triage. The intended project was an NLP category classifier, but the real data has one dominant category (97% USER_SUPPORT) and sparse descriptions, so classification is not meaningful.",
        "The honest, useful angle the data does support is operational: priority mix and resolution time. This page analyzes 332 real tickets through that lens.",
      ],
      cards: [
        { label: "Problem Type", value: "Operational CS Analytics" },
        { label: "Source", value: "332 real tickets (1 client)" },
        { label: "Reframed From", value: "NLP classifier (not viable)" },
      ],
    },
    dataSources: {
      headline: "Support ticket workflow from one client.",
      description: "Tickets with priority, status, and a full timestamp workflow (raised, acknowledged, in-progress, completed). Free-text descriptions exist but are sparse and not used here.",
      tables: [
        { name: "support_tickets", fields: ["priority", "status", "raised_at", "completed_at", "category"], note: "Priority + timestamp workflow", primary: true },
      ],
    },
    methodology: {
      headline: "Measure triage mix and time-to-resolve.",
      description: "Straightforward operational metrics from the ticket lifecycle timestamps.",
      steps: [
        { step: "01", title: "Category Check", desc: "Found one dominant category (97% USER_SUPPORT) — classification abandoned as not meaningful." },
        { step: "02", title: "Priority Mix", desc: "Distribution across P1 (no workaround), P2 (workaround), and P3 (normal)." },
        { step: "03", title: "Resolution Time", desc: "completed_at minus raised_at, kept between 0 and 60 days." },
        { step: "04", title: "By-Priority Medians", desc: "Median resolution time per priority band; medians resist the long tail." },
      ],
    },
    analysis: {
      headline: "Real triage and resolution patterns.",
      description: "332 tickets; 146 with a clean raised-to-completed interval. The P2-vs-P3 inversion below is a real, non-obvious finding.",
      kpis: [
        { value: "9.0h", label: "Median Resolution", sub: "146 completed tickets", color: "#1566FF" },
        { value: "3.7h", label: "P1 Median", sub: "Urgent, no workaround (n=8)", color: "#27AE60" },
        { value: "13.3h", label: "P2 Median", sub: "Slower than P3 (n=50)", color: "#C0392B" },
        { value: "332", label: "Tickets Analyzed", sub: "P3 159 / P2 62 / P1 10", color: "#475175" },
      ],
      charts: [
        { title: "Median Resolution Time by Priority", subtitle: "Hours from raised to completed (n in tooltip)", data: [
          { label: "P2 (workaround)", value: 13.3, n: 50 },
          { label: "P3 (normal)", value: 6.6, n: 88 },
          { label: "P1 (no workaround)", value: 3.7, n: 8 },
        ] },
      ],
    },
    insights: {
      headline: "What the ticket workflow shows.",
      items: [
        { title: "P1s are handled fast, as they should be", desc: "No-workaround urgent tickets resolve in a median 3.7 hours — triage is working at the top of the priority stack." },
        { title: "P2 is slower than P3 — the real surprise", desc: "Urgent-with-workaround tickets sit a median 13.3 hours versus 6.6 for normal ones. The workaround likely removes the pressure to close, so they linger. Worth a process look." },
        { title: "Volume is routine, not crisis", desc: "P3 normal tickets dominate (159 of 231), so the queue is mostly routine support, not firefighting." },
        { title: "Limitation: single client, one category", desc: "This is one client's tickets and almost entirely USER_SUPPORT, so it informs CS operations but does not generalize to a network-wide classifier." },
      ],
    },
    future: {
      headline: "From timing to action.",
      items: [
        { title: "Fix the P2 lag", desc: "Set an explicit P2 resolution target so workaround-available tickets do not outlast normal ones." },
        { title: "Richer categories", desc: "If the CS tool captured sub-categories, an NLP classifier could become viable; today the label is too coarse." },
        { title: "SLA breach prediction", desc: "With per-priority targets defined, predict which open tickets will breach using age and workflow state." },
        { title: "Multi-client pull", desc: "Bring in other clients' tickets to test whether the P2 pattern holds network-wide." },
      ],
    },
  },

  "07-soap-nlp": {
    businessProblem: {
      headline: "SOAP notes NLP — in development.",
      paragraphs: [
        "This project requires a dedicated SOAP-notes table (soap_analytics), which exists only for clients that record structured clinical encounters. No such source is available in the current anonymized dataset, so the analysis has not been run.",
        "The page is published as a placeholder describing the intended approach. Real results will be added once the source data is available.",
      ],
      cards: [
        { label: "Status", value: "In Development" },
        { label: "Blocker", value: "No soap_analytics source yet" },
        { label: "Planned Method", value: "TF-IDF + LDA + NER" },
      ],
    },
    dataSources: {
      headline: "Pending source data.",
      description: "Requires a soap_analytics table with clinical note text. Not present in the current dataset.",
      tables: [
        { name: "soap_analytics", fields: ["note_content", "note_type"], note: "Not yet available — required source", primary: true },
      ],
    },
    methodology: {
      headline: "Planned approach (not yet executed).",
      description: "Documented as intent. No metrics are reported because no analysis has been run.",
      steps: [
        { step: "01", title: "Text Cleaning", desc: "Preserve medical abbreviations and dosages." },
        { step: "02", title: "Topic Modeling", desc: "LDA to surface recurring clinical themes." },
        { step: "03", title: "Entity Recognition", desc: "Extract symptoms, medications, anatomy." },
      ],
    },
    analysis: {
      headline: "No results yet.",
      description: "This project is in development. Metrics will appear here once the source data is available and the analysis is run.",
      kpis: [
        { value: "—", label: "Pending", sub: "Awaiting source data", color: "#8B95B8" },
      ],
      charts: [],
    },
    insights: {
      headline: "Pending analysis.",
      items: [
        { title: "In development", desc: "Findings will be published after the SOAP-notes source becomes available and the analysis is completed." },
      ],
    },
    future: {
      headline: "Next step.",
      items: [
        { title: "Secure a soap_analytics source", desc: "Once structured SOAP notes are available, run the planned topic-modeling and NER pipeline and report real results." },
      ],
    },
  },

  "08-radiology-parser": {
    businessProblem: {
      headline: "Radiology impression parser — in development.",
      paragraphs: [
        "This project parses free-text radiology impressions (the word_value field) into structured findings. The current dataset contains only sparse, scattered free-text in that field — not enough to build or validate a parser honestly.",
        "The page is published as a placeholder describing the intended approach. Real results will be added once sufficient radiology free-text is available.",
      ],
      cards: [
        { label: "Status", value: "In Development" },
        { label: "Blocker", value: "Sparse word_value free-text" },
        { label: "Planned Method", value: "Regex + Multilingual NLP" },
      ],
    },
    dataSources: {
      headline: "Insufficient source data.",
      description: "Requires populated free-text radiology impressions in patient_service_results.word_value. Only sparse entries exist in the current dataset.",
      tables: [
        { name: "patient_service_results", fields: ["word_value", "service_name"], note: "word_value is sparsely populated — insufficient to date", primary: true },
      ],
    },
    methodology: {
      headline: "Planned approach (not yet executed).",
      description: "Documented as intent. No metrics are reported because no analysis has been run.",
      steps: [
        { step: "01", title: "Corpus Analysis", desc: "Catalog common impression phrases." },
        { step: "02", title: "Regex Extraction", desc: "Match organ names and associated findings." },
        { step: "03", title: "Classification", desc: "Normal vs abnormal per organ." },
      ],
    },
    analysis: {
      headline: "No results yet.",
      description: "This project is in development. Metrics will appear here once sufficient radiology free-text is available.",
      kpis: [
        { value: "—", label: "Pending", sub: "Awaiting source data", color: "#8B95B8" },
      ],
      charts: [],
    },
    insights: {
      headline: "Pending analysis.",
      items: [
        { title: "In development", desc: "Findings will be published after sufficient radiology free-text is available and the parser is built and validated." },
      ],
    },
    future: {
      headline: "Next step.",
      items: [
        { title: "Gather radiology free-text", desc: "Once enough word_value impressions are available, build and validate the parser and report real accuracy." },
      ],
    },
  },

  "09-cross-client-benchmark": {
    businessProblem: {
      headline: "How do 13 healthcare organizations compare — once you make the data comparable at all?",
      paragraphs: [
        "Each lab in the network operates in isolation, with no view of how its completion, cancellation, or abnormal-result rates compare to peers. This project pools 13 anonymized clients to build that comparison.",
        "The first real finding is a humbling one: most of these metrics are not directly comparable until the schemas are aligned. Clients use different status vocabularies, so a naive completion-rate comparison is misleading. The honest version reports only what survives normalization.",
      ],
      cards: [
        { label: "Problem Type", value: "Comparative Analytics" },
        { label: "Clients Pooled", value: "13 (samples)" },
        { label: "Honest Caveat", value: "Schema alignment first" },
      ],
    },
    dataSources: {
      headline: "Thirteen clients, the shared core tables, normalized into one view.",
      description: "Per-client rates computed from anonymized patient_services (completion), orders (cancellation), and patient_service_results (abnormal). All figures are sample-based rates, not population counts.",
      tables: [
        { name: "patient_services", fields: ["status"], note: "Completion rate — but status vocabularies differ across clients", primary: true },
        { name: "orders", fields: ["is_cancelled"], note: "Cancellation rate" },
        { name: "patient_service_results", fields: ["number_value", "ref_range_min", "ref_range_max"], note: "Abnormal rate for quality comparison" },
      ],
    },
    methodology: {
      headline: "Normalize first, compare only what aligns.",
      description: "The hard part is not the statistics — it is making 13 differently-structured exports mean the same thing before comparing them.",
      steps: [
        { step: "01", title: "Per-Client Rates", desc: "Completion = share of patient_services marked COMPLETED; cancellation = mean of orders.is_cancelled; abnormal = results outside reference range." },
        { step: "02", title: "Vocabulary Check", desc: "Status labels are not standardized — some clients never use COMPLETED, so their raw completion rate reads near 0% despite normal operations." },
        { step: "03", title: "Comparability Filter", desc: "Only clients with enough rows and aligned vocabularies are compared per metric (5 to 8 clients depending on the metric)." },
        { step: "04", title: "Spread Analysis", desc: "Report min, max, and spread per metric across the comparable clients, with sample-size caveats." },
        { step: "05", title: "Honest Framing", desc: "No currency normalization or volume ranking is attempted — sample caps make volume meaningless and amounts are jittered." },
      ],
    },
    analysis: {
      headline: "What actually compares — and what does not.",
      description: "Computed across 13 anonymized clients. Completion rate is shown to be NOT cleanly comparable; abnormal and cancellation rates are.",
      kpis: [
        { value: "13", label: "Clients in Dataset", sub: "8 comparable on some metric", color: "#1566FF" },
        { value: "2.8x", label: "Abnormal-Rate Spread", sub: "16.7% to 46.3% (5 clients)", color: "#C7AA50" },
        { value: "6.8%", label: "Avg Cancellation", sub: "range 0% to 16% (6 clients)", color: "#475175" },
        { value: "Schema", label: "Normalize First", sub: "completion not comparable until status labels align", color: "#C0392B" },
      ],
      charts: [
        { title: "Abnormal Result Rate by Client", subtitle: "The cleanest comparable metric — clients with n>=20 labeled results", data: [
          { label: "Client 08", value: 46.3 },
          { label: "Client 02", value: 34.5 },
          { label: "Client 01", value: 31.1 },
          { label: "Client 05", value: 20.7 },
          { label: "Client 11", value: 16.7 },
        ] },
      ],
    },
    insights: {
      headline: "What cross-client comparison really reveals.",
      items: [
        { title: "The headline finding is a data problem, not an ops ranking", desc: "Status vocabularies are not standardized: some clients never record COMPLETED, so their raw completion rate looks like 0 to 2% despite operating normally. Any benchmark must normalize labels first." },
        { title: "Abnormal rates vary 2.8x across comparable clients", desc: "From 16.7% to 46.3% — a real, defensible spread even on samples, pointing to genuinely different case mixes or reference-range practices." },
        { title: "Cancellation rates range from 0% to 16%", desc: "Wide variation across the six clients with usable order data, worth investigating per client." },
        { title: "Limitation: samples plus anonymized identity = illustrative", desc: "500-row caps make volume comparisons meaningless, and anonymization hides which lab is which — so this demonstrates the method, not a production league table." },
      ],
    },
    future: {
      headline: "From showcase to product feature.",
      items: [
        { title: "Status vocabulary mapping", desc: "Build a canonical status taxonomy and map each client's labels into it — the prerequisite for any real benchmark." },
        { title: "Benchmark Intelligence product", desc: "Once normalized, tell each lab where it stands versus peers. No competitor holds this cross-client data." },
        { title: "Peer-group matching", desc: "Compare labs to similar-size peers rather than the whole network for fairer benchmarks." },
        { title: "Full-population pull", desc: "Replace the 500-row samples with full exports so volume and revenue-per-patient become comparable too." },
      ],
    },
  },

};
