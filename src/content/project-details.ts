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
      headline: "Can we predict which lab services will be delayed before they are?",
      paragraphs: [
        "Turnaround time is one of the most critical operational metrics for diagnostic laboratories. Delays affect patient experience, physician decision-making, and SLA compliance.",
        "This project predicts whether a lab service will exceed its expected completion window based on branch, service type, collection time, and workload indicators.",
      ],
      cards: [
        { label: "Problem Type", value: "Regression" },
        { label: "Target Variable", value: "turnaround_minutes" },
        { label: "Operational Value", value: "Bottleneck identification" },
      ],
    },
    dataSources: {
      headline: "Timestamp-rich service execution data across all clients.",
      description: "Turnaround time is derived from the difference between collected_at and locked_at timestamps in patient_services.",
      tables: [
        { name: "patient_services", fields: ["created_at", "collected_at", "locked_at", "service_name", "status"], note: "Primary — timestamps define TAT", primary: true },
        { name: "patients", fields: ["patient_age", "patient_sex"], note: "Demographic context" },
        { name: "orders", fields: ["branch_names", "partner_name", "created_at"], note: "Branch and volume context" },
      ],
    },
    methodology: {
      headline: "Engineer time features, model delay drivers.",
      description: "The core challenge is datetime feature engineering — extracting meaningful predictors from raw timestamps.",
      steps: [
        { step: "01", title: "TAT Calculation", desc: "turnaround_minutes = locked_at - collected_at. Negative and null values excluded." },
        { step: "02", title: "Feature Engineering", desc: "Hour of collection, day of week, branch volume (same-hour count), service category, is_weekend flag." },
        { step: "03", title: "Outlier Handling", desc: "TAT values beyond 99th percentile capped to prevent extreme outliers from dominating the model." },
        { step: "04", title: "Model Training", desc: "Linear Regression (baseline), Random Forest Regressor, Gradient Boosting. 80/20 split." },
        { step: "05", title: "Validation", desc: "MAE and RMSE as primary metrics. Residual analysis to check for systematic bias by branch or service." },
      ],
    },
    analysis: {
      headline: "Delay patterns and model performance.",
      description: "Placeholder metrics — will be populated with real anonymized data.",
      kpis: [
        { value: "34%", label: "Delay Reduction", sub: "Predicted vs actual", color: "#27AE60" },
        { value: "18min", label: "MAE", sub: "Mean Absolute Error", color: "#1566FF" },
        { value: "42min", label: "Median TAT", sub: "Across all services", color: "#475175" },
        { value: "3.2x", label: "Peak Slowdown", sub: "Monday AM vs baseline", color: "#C7AA50" },
      ],
      charts: [
        { title: "TAT Distribution by Service Type", subtitle: "Box plot" },
        { title: "Hourly Volume vs Avg TAT", subtitle: "Dual-axis line chart" },
      ],
    },
    insights: {
      headline: "What drives delays operationally.",
      items: [
        { title: "Monday mornings are the bottleneck", desc: "Volume spikes at week-start combined with backlog from weekends create predictable delay patterns." },
        { title: "Branch matters more than service type", desc: "The same CBC test has vastly different TATs across branches, suggesting staffing — not test complexity — drives delays." },
        { title: "Collection hour is the strongest single feature", desc: "Samples collected between 10-11 AM (peak volume) have 40% longer TATs than early-morning collections." },
        { title: "Limitation: locked_at may reflect data entry, not completion", desc: "If staff batch-lock results at end of shift, the timestamp overstates actual processing time." },
      ],
    },
    future: {
      headline: "Production improvements.",
      items: [
        { title: "Real-time alerting", desc: "Flag services predicted to breach SLA before they do, enabling proactive resource reallocation." },
        { title: "Branch-specific models", desc: "Per-branch models could capture local patterns that a global model misses." },
        { title: "Staffing optimization", desc: "Correlate predicted TAT with shift schedules to identify understaffed windows." },
        { title: "Queue position feature", desc: "Adding the sample's position in the processing queue would likely improve prediction accuracy." },
      ],
    },
  },

  "03-patient-segmentation": {
    businessProblem: {
      headline: "Who are the distinct patient groups — and how should operations adapt to each?",
      paragraphs: [
        "Healthcare labs serve many types of patients: frequent visitors, one-time checkups, corporate APE patients, senior citizens with chronic monitoring needs. Treating them all identically wastes resources.",
        "This project clusters patients into behavioral segments using visit frequency, spending, service utilization, and demographics to inform targeted outreach and operational planning.",
      ],
      cards: [
        { label: "Problem Type", value: "Unsupervised Clustering" },
        { label: "Method", value: "K-Means + PCA" },
        { label: "Operational Value", value: "Patient outreach & planning" },
      ],
    },
    dataSources: {
      headline: "Four tables joined to build a patient-level feature set.",
      description: "Each patient becomes one row with aggregated behavioral features derived from their full transaction and service history.",
      tables: [
        { name: "patients", fields: ["patient_age", "patient_sex", "patient_civil_status"], note: "Demographics", primary: true },
        { name: "orders", fields: ["total_amount", "total_discount", "created_at"], note: "Spending and visit frequency" },
        { name: "order_items", fields: ["product_name", "type"], note: "Service mix per patient" },
        { name: "patient_services", fields: ["service_name", "status", "created_at"], note: "Utilization patterns" },
      ],
    },
    methodology: {
      headline: "Aggregate, scale, cluster, interpret.",
      description: "The key challenge is building meaningful patient-level features from transaction-level data.",
      steps: [
        { step: "01", title: "Feature Aggregation", desc: "Per-patient: total visits, total spend, avg spend per visit, unique services count, discount usage rate, days since last visit." },
        { step: "02", title: "Scaling", desc: "StandardScaler applied — K-Means is distance-based so features must be on the same scale." },
        { step: "03", title: "Optimal K Selection", desc: "Elbow method + silhouette score. Tested K=3 through K=8." },
        { step: "04", title: "Clustering", desc: "K-Means with K=5 selected. PCA (2 components) for visualization." },
        { step: "05", title: "Segment Profiling", desc: "Each cluster profiled by demographics, spending, frequency, and service mix to assign business-meaningful labels." },
      ],
    },
    analysis: {
      headline: "Five distinct patient segments emerged.",
      description: "Placeholder labels — will be refined with real anonymized data.",
      kpis: [
        { value: "5", label: "Segments Found", sub: "Optimal K by silhouette", color: "#1566FF" },
        { value: "0.41", label: "Silhouette Score", sub: "Moderate separation", color: "#27AE60" },
        { value: "62%", label: "Variance Explained", sub: "First 2 PCA components", color: "#475175" },
        { value: "38%", label: "High-Value Segment", sub: "Top spending cluster", color: "#C7AA50" },
      ],
      charts: [
        { title: "PCA Scatter — 5 Clusters", subtitle: "2D scatter plot colored by cluster" },
        { title: "Segment Profiles Radar", subtitle: "Radar chart comparing clusters across features" },
      ],
    },
    insights: {
      headline: "Segment-level operational implications.",
      items: [
        { title: "High-frequency, low-spend patients dominate volume", desc: "The largest cluster visits often but spends little per visit — likely routine monitoring patients." },
        { title: "Corporate APE patients form a distinct cluster", desc: "High discount rates and bulk ordering patterns clearly separate corporate from walk-in patients." },
        { title: "Senior patients cluster by service type, not just age", desc: "Age alone does not define the senior segment — their unique service mix (CBC, lipid panels) is the differentiator." },
        { title: "Limitation: clustering is descriptive, not causal", desc: "Segments describe behavior patterns but do not explain why patients behave differently." },
      ],
    },
    future: {
      headline: "From segments to actions.",
      items: [
        { title: "Recall campaigns by segment", desc: "High-value patients due for annual checkups could receive targeted follow-ups." },
        { title: "Package design per segment", desc: "Test bundles tailored to each segment's typical service mix." },
        { title: "Churn prediction layer", desc: "Add a supervised model on top to predict which patients are likely to stop visiting." },
        { title: "Real-time segment assignment", desc: "New patients could be assigned to a segment at registration based on demographics and first order." },
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
      headline: "Are there unusual discount or revenue patterns that need operational attention?",
      paragraphs: [
        "Healthcare labs process thousands of financial transactions daily. Discounts, voids, and cancellations happen routinely — but some patterns may indicate errors, policy violations, or systemic issues.",
        "This project detects statistically unusual transactions at the branch and cashier level to support operational audits.",
      ],
      cards: [
        { label: "Problem Type", value: "Anomaly Detection" },
        { label: "Method", value: "Isolation Forest + Z-score" },
        { label: "Operational Value", value: "Financial compliance" },
      ],
    },
    dataSources: {
      headline: "Transaction and line-item data across all clients.",
      description: "Financial amounts are jittered by the anonymization pipeline but distribution patterns are preserved.",
      tables: [
        { name: "orders", fields: ["total_amount", "total_discount", "is_cancelled", "created_at"], note: "Transaction-level financials", primary: true },
        { name: "order_items", fields: ["amount", "type", "status", "discount"], note: "Line-item detail" },
      ],
    },
    methodology: {
      headline: "Define normal, then find what deviates.",
      description: "Two complementary approaches: statistical thresholding and ML-based isolation.",
      steps: [
        { step: "01", title: "Feature Engineering", desc: "Discount-to-total ratio, void rate per day, cancellation rate, branch daily revenue, transaction count." },
        { step: "02", title: "Statistical Detection", desc: "Z-score method: flag transactions where discount ratio exceeds 3 standard deviations from branch mean." },
        { step: "03", title: "ML Detection", desc: "Isolation Forest with contamination=0.02, trained on normal transaction patterns." },
        { step: "04", title: "Ensemble Scoring", desc: "A transaction is flagged anomalous only if both methods agree — reduces false positives." },
        { step: "05", title: "Contextualization", desc: "Anomalies grouped by branch, day-of-week, and discount type to identify systematic vs one-off issues." },
      ],
    },
    analysis: {
      headline: "Anomaly patterns across branches.",
      description: "Placeholder — real anomalies detected after anonymized financial data is processed.",
      kpis: [
        { value: "2.3%", label: "Anomaly Rate", sub: "Flagged transactions", color: "#C0392B" },
        { value: "4.1x", label: "Highest Deviation", sub: "Discount ratio outlier", color: "#C7AA50" },
        { value: "89%", label: "Agreement Rate", sub: "Both methods agree", color: "#27AE60" },
        { value: "3", label: "Branches Flagged", sub: "Systematic patterns", color: "#1566FF" },
      ],
      charts: [
        { title: "Discount Ratio Distribution with Anomaly Threshold", subtitle: "Histogram with Z-score cutoff line" },
        { title: "Daily Revenue by Branch — Anomalies Highlighted", subtitle: "Time series with flagged points" },
      ],
    },
    insights: {
      headline: "Operational implications of detected anomalies.",
      items: [
        { title: "Senior/PWD discounts cluster in specific branches", desc: "Some branches show 3x the discount rate of others — may reflect demographics or may indicate policy inconsistency." },
        { title: "End-of-day voids spike on certain days", desc: "A pattern of voids concentrated in the last hour of operation warrants process review." },
        { title: "Most anomalies are benign on investigation", desc: "Bulk corporate orders with legitimate volume discounts trigger the detector — context matters." },
        { title: "Limitation: anonymized amounts reduce precision", desc: "The jittering in anonymize.py slightly blurs exact thresholds. Production deployment would use real amounts." },
      ],
    },
    future: {
      headline: "From detection to prevention.",
      items: [
        { title: "Real-time cashier alerts", desc: "Flag unusual transactions at point-of-sale, not after the fact in a monthly report." },
        { title: "Cashier-level profiling", desc: "Track per-cashier void and discount rates to identify training needs or policy gaps." },
        { title: "Seasonal baseline adjustment", desc: "Normal discount patterns shift during APE season — baselines should adapt." },
        { title: "Integration with audit workflows", desc: "Flagged transactions auto-routed to finance team for review." },
      ],
    },
  },

  "06-ticket-intelligence": {
    businessProblem: {
      headline: "Can we classify support tickets and predict SLA breaches before they happen?",
      paragraphs: [
        "The Dashlabs CS team handles hundreds of support tickets per week across multiple clients. Tickets are manually triaged, classified, and routed — a process that depends on the Triager's experience.",
        "This project builds an NLP classifier for ticket categorization and a time-based model to predict which tickets are likely to breach their SLA window.",
      ],
      cards: [
        { label: "Problem Type", value: "NLP + Classification" },
        { label: "Method", value: "TF-IDF + Logistic Regression" },
        { label: "Operational Value", value: "Faster triage & SLA compliance" },
      ],
    },
    dataSources: {
      headline: "Support ticket history from the CS platform.",
      description: "Ticket descriptions, timestamps, priority labels, and resolution metadata.",
      tables: [
        { name: "support_tickets", fields: ["description", "category", "priority", "created_at", "resolved_at", "status"], note: "Ticket text and metadata", primary: true },
      ],
    },
    methodology: {
      headline: "Two models: classify the ticket, predict the breach.",
      description: "The classification model handles routing; the SLA model handles urgency.",
      steps: [
        { step: "01", title: "Text Preprocessing", desc: "Lowercase, remove special characters, tokenize. No stemming — healthcare terms lose meaning when stemmed." },
        { step: "02", title: "Feature Extraction", desc: "TF-IDF with max_features=5000, bigrams included. Priority label as additional feature for SLA model." },
        { step: "03", title: "Category Classifier", desc: "Logistic Regression with multi-class output. Categories: machine issue, results query, billing, product setup, other." },
        { step: "04", title: "SLA Breach Predictor", desc: "Binary classifier: will this ticket breach P1/P2/P3 SLA threshold? Features: ticket age, category, priority, word count." },
        { step: "05", title: "Validation", desc: "5-fold cross-validation. F1-macro for classifier, precision@80%recall for SLA model." },
      ],
    },
    analysis: {
      headline: "Classification and SLA prediction results.",
      description: "Placeholder metrics from initial model runs.",
      kpis: [
        { value: "91%", label: "Classification F1", sub: "Macro average", color: "#27AE60" },
        { value: "78%", label: "SLA Breach Recall", sub: "Catches 78% of breaches", color: "#1566FF" },
        { value: "240m", label: "P1 SLA Threshold", sub: "4 hours", color: "#C0392B" },
        { value: "34%", label: "Auto-Classifiable", sub: "High-confidence tickets", color: "#C7AA50" },
      ],
      charts: [
        { title: "Confusion Matrix — Ticket Category Classifier", subtitle: "5-class heatmap" },
        { title: "SLA Breach Prediction — Precision vs Recall Curve", subtitle: "Trade-off visualization" },
      ],
    },
    insights: {
      headline: "What the model reveals about CS operations.",
      items: [
        { title: "Machine transmission issues are the most common category", desc: "Over 30% of tickets relate to LIS/RIS connectivity — a signal for the product team." },
        { title: "P1 tickets that mention 'down' or 'cannot' breach 2x more often", desc: "Specific keywords are strong SLA breach predictors independent of priority label." },
        { title: "Ticket length correlates with resolution time", desc: "Longer tickets take longer to resolve — possibly because they describe more complex issues." },
        { title: "Limitation: draft.js JSON in escalation fields requires parsing", desc: "Some ticket metadata is stored in Draft.js JSON format, requiring regex extraction." },
      ],
    },
    future: {
      headline: "From manual triage to intelligent routing.",
      items: [
        { title: "Auto-classification at ticket creation", desc: "The AI Ticket Creator could use this model to pre-classify incoming Viber messages." },
        { title: "SLA breach early warning", desc: "Alert the CS team when a ticket crosses 50% of its SLA window and the model predicts likely breach." },
        { title: "Solver skill matching", desc: "Route tickets to solvers based on category — machine issues to tech-savvy solvers, billing to finance-aware ones." },
        { title: "Feedback loop for model improvement", desc: "Triager corrections to auto-classifications become retraining data." },
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
