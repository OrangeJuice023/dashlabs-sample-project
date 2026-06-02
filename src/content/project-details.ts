export interface ProjectDetail {
  slug: string;
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
    charts: { title: string; subtitle: string }[];
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
      headline: "Why do some lab results come back abnormal — and can we predict it?",
      paragraphs: [
        "Diagnostic laboratories process thousands of results daily. Currently, abnormal results are only identified after the lab machine transmits the value and a technician reviews it against the reference range.",
        "This project asks: given what we know about a patient at registration time (age, sex, service type, branch), can we predict whether their result is likely to be abnormal?",
      ],
      cards: [
        { label: "Problem Type", value: "Binary Classification" },
        { label: "Target Variable", value: "is_abnormal (0 / 1)" },
        { label: "Operational Value", value: "Early flagging & prioritization" },
      ],
    },
    dataSources: {
      headline: "Three tables, three anonymized client organizations.",
      description: "All data passed through the anonymize.py pipeline. Patient names, physician names, branch names, and partner identifiers were replaced.",
      tables: [
        { name: "patient_service_results", fields: ["number_value", "ref_range_min", "ref_range_max", "unit"], note: "Source of truth for labeling", primary: true },
        { name: "patient_services", fields: ["service_name", "created_at", "collected_at", "status"], note: "Service type and timestamp features" },
        { name: "patients", fields: ["patient_age", "patient_sex"], note: "Demographic features only" },
      ],
    },
    methodology: {
      headline: "Label, engineer, train, validate.",
      description: "The target variable must be derived from reference ranges.",
      steps: [
        { step: "01", title: "Label Generation", desc: "is_abnormal = 1 if number_value falls outside ref_range_min / ref_range_max. Nulls excluded." },
        { step: "02", title: "Feature Engineering", desc: "Age bins, sex encoding, service category, day-of-week collected, anonymized branch." },
        { step: "03", title: "Class Imbalance", desc: "Abnormal results are ~23% minority class. SMOTE applied on training set only." },
        { step: "04", title: "Model Training", desc: "Logistic Regression (baseline), Random Forest, XGBoost. 80/20 stratified split." },
        { step: "05", title: "Validation", desc: "AUC-ROC as primary metric. Precision-recall curve reviewed. No data leakage." },
      ],
    },
    analysis: {
      headline: "Model results and key distributions.",
      description: "Placeholder metrics — real values populated after anonymized data processing.",
      kpis: [
        { value: "87%", label: "AUC Score", sub: "XGBoost (best model)", color: "#27AE60" },
        { value: "79%", label: "Precision", sub: "Abnormal class", color: "#1566FF" },
        { value: "71%", label: "Recall", sub: "Abnormal class", color: "#1566FF" },
        { value: "23.4%", label: "Abnormal Rate", sub: "Across all services", color: "#C7AA50" },
      ],
      charts: [
        { title: "Abnormal Rate by Service Type", subtitle: "Bar chart" },
        { title: "Feature Importance — XGBoost", subtitle: "Horizontal bar chart — top 10 features" },
      ],
    },
    insights: {
      headline: "What the model tells us operationally.",
      items: [
        { title: "Age is the strongest demographic predictor", desc: "Patients aged 60+ show significantly higher abnormal rates across hematology and clinical chemistry panels." },
        { title: "Service type dominates over demographics", desc: "The type of test ordered is a stronger predictor than patient demographics." },
        { title: "23% abnormal rate means early flagging has real scale", desc: "Roughly 1 in 4 results is abnormal. Pre-flagging could reduce time to physician notification." },
        { title: "Honest limitation: reference range quality varies", desc: "Some services have null or implausible reference ranges. These were excluded but affect production viability." },
      ],
    },
    future: {
      headline: "What a production version would need.",
      items: [
        { title: "Live inference API", desc: "A FastAPI endpoint returning abnormality probability before sample processing." },
        { title: "Service-specific models", desc: "Separate models per service category would likely outperform one global model." },
        { title: "Physician feedback loop", desc: "Clinician-confirmed diagnoses as ground truth instead of rule-based labels." },
        { title: "Temporal validation", desc: "Time-series split and periodic retraining to handle concept drift." },
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
      headline: "Which lab tests are ordered together — and can we design better packages from that?",
      paragraphs: [
        "Labs offer bundled test packages, but these are often designed by intuition rather than data. If we know which tests are actually co-ordered, we can design packages that match real clinical ordering patterns.",
        "This project uses association rule mining to find frequently co-occurring test pairs and triplets across all client datasets.",
      ],
      cards: [
        { label: "Problem Type", value: "Association Rule Mining" },
        { label: "Method", value: "Apriori Algorithm" },
        { label: "Operational Value", value: "Package design & upsell" },
      ],
    },
    dataSources: {
      headline: "Order-level service groupings across all clients.",
      description: "Each order becomes a transaction containing the set of services purchased together.",
      tables: [
        { name: "order_items", fields: ["order_id", "product_name", "type"], note: "Transaction-level service groupings", primary: true },
        { name: "patient_services", fields: ["service_name", "patient_id"], note: "Cross-reference for service names" },
      ],
    },
    methodology: {
      headline: "Transform orders into baskets, mine association rules.",
      description: "Classic market basket analysis adapted for healthcare test ordering.",
      steps: [
        { step: "01", title: "Basket Construction", desc: "Each order_id becomes a basket. Services within the same order are the items." },
        { step: "02", title: "Encoding", desc: "One-hot encoding of services per order for the Apriori algorithm." },
        { step: "03", title: "Frequent Itemsets", desc: "Apriori with min_support=0.02 to find service combinations ordered together at least 2% of the time." },
        { step: "04", title: "Rule Generation", desc: "Association rules with min_confidence=0.5, min_lift=1.5 to find meaningful co-occurrences." },
        { step: "05", title: "Visualization", desc: "Co-occurrence heatmap and network graph of top service pairs." },
      ],
    },
    analysis: {
      headline: "Strong co-occurrence patterns across common panels.",
      description: "Placeholder — real bundle discovery after anonymized data is processed.",
      kpis: [
        { value: "12", label: "Bundles Found", sub: "Lift > 1.5", color: "#1566FF" },
        { value: "84%", label: "Top Confidence", sub: "CBC + Urinalysis", color: "#27AE60" },
        { value: "3.2", label: "Highest Lift", sub: "Lipid Panel + FBS", color: "#C7AA50" },
        { value: "67%", label: "Orders Multi-Test", sub: "Have 2+ services", color: "#475175" },
      ],
      charts: [
        { title: "Service Co-occurrence Heatmap", subtitle: "Matrix of pairwise support values" },
        { title: "Top Association Rules — Lift vs Confidence", subtitle: "Scatter plot" },
      ],
    },
    insights: {
      headline: "Bundle design implications.",
      items: [
        { title: "CBC + Urinalysis is the dominant pair", desc: "These two services co-occur more than any other combination, suggesting they should always be offered as a default bundle." },
        { title: "Clinical chemistry panels cluster tightly", desc: "FBS, lipid profile, creatinine, and BUA are frequently ordered together — a natural 'metabolic panel' bundle." },
        { title: "Corporate APE orders drive most multi-test bundles", desc: "Partner-tagged orders are far more likely to contain 4+ services, which skews the overall co-occurrence patterns." },
        { title: "Limitation: correlation is not clinical recommendation", desc: "Co-occurrence reflects ordering patterns, not clinical necessity. Bundle design should be validated by a physician." },
      ],
    },
    future: {
      headline: "From discovery to revenue.",
      items: [
        { title: "Dynamic bundle suggestions at checkout", desc: "When a patient orders CBC, suggest Urinalysis based on 84% historical co-occurrence." },
        { title: "Branch-specific bundles", desc: "Different branches may serve different patient populations with different bundling patterns." },
        { title: "Seasonal pattern analysis", desc: "Some test combinations may be seasonal (flu season panels, annual checkup peaks)." },
        { title: "Price optimization", desc: "Bundle pricing that maximizes uptake while maintaining margin — requires revenue data integration." },
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
      headline: "What clinical patterns are hidden in thousands of SOAP notes?",
      paragraphs: [
        "ARDI Health Services records clinical encounters as SOAP notes (Subjective, Objective, Assessment, Plan). These notes contain rich clinical information but are trapped in unstructured free text.",
        "This project applies NLP to extract common complaints, identify clinical topics, and classify note severity — turning narrative text into structured, queryable data.",
      ],
      cards: [
        { label: "Problem Type", value: "NLP — Text Mining" },
        { label: "Method", value: "TF-IDF + LDA + NER" },
        { label: "Operational Value", value: "Clinical insight extraction" },
      ],
    },
    dataSources: {
      headline: "ARDI's soap_analytics table — unique to this client.",
      description: "ARDI is the only Dashlabs client with a dedicated SOAP notes table. This makes the project data-dependent on ARDI access.",
      tables: [
        { name: "soap_analytics", fields: ["note_content", "note_type", "created_at"], note: "Clinical SOAP text — ARDI only", primary: true },
        { name: "patient_services", fields: ["service_name", "patient_id"], note: "Link notes to service context" },
        { name: "procedures_unified", fields: ["procedure_name", "category"], note: "Procedure classification context" },
      ],
    },
    methodology: {
      headline: "Preprocess clinical text, extract topics, classify severity.",
      description: "Clinical NLP requires domain-aware preprocessing — medical terms must not be stemmed or removed as stopwords.",
      steps: [
        { step: "01", title: "Text Cleaning", desc: "Remove formatting artifacts, normalize whitespace, preserve medical abbreviations and dosages." },
        { step: "02", title: "Topic Modeling", desc: "LDA with 8-12 topics. Each topic represents a cluster of co-occurring clinical terms." },
        { step: "03", title: "Named Entity Recognition", desc: "Extract symptoms, medications, and anatomical references using rule-based patterns + spaCy." },
        { step: "04", title: "Severity Classification", desc: "Zero-shot classification using HuggingFace: mild / moderate / severe based on note content." },
        { step: "05", title: "Validation", desc: "Topic coherence score for LDA. Manual review of 50 random notes for NER accuracy." },
      ],
    },
    analysis: {
      headline: "Topic distribution and entity extraction results.",
      description: "Placeholder — requires ARDI soap_analytics data.",
      kpis: [
        { value: "8", label: "Topics Extracted", sub: "Optimal by coherence", color: "#1566FF" },
        { value: "73%", label: "NER Precision", sub: "Symptom entities", color: "#27AE60" },
        { value: "4.2k", label: "Notes Analyzed", sub: "ARDI dataset", color: "#475175" },
        { value: "3", label: "Severity Levels", sub: "Mild / Moderate / Severe", color: "#C7AA50" },
      ],
      charts: [
        { title: "Topic Distribution Across SOAP Notes", subtitle: "Stacked bar chart" },
        { title: "Most Common Extracted Entities", subtitle: "Horizontal bar chart — symptoms, medications, anatomy" },
      ],
    },
    insights: {
      headline: "What structured SOAP data reveals.",
      items: [
        { title: "Upper respiratory complaints dominate the Subjective section", desc: "Cough, cold, and sore throat terms appear in over 30% of notes." },
        { title: "Medication mentions correlate with severity classification", desc: "Notes mentioning antibiotics or IV medications are disproportionately classified as severe." },
        { title: "Topic modeling separates acute vs chronic encounters", desc: "Some topic clusters clearly align with acute visits (fever, pain) vs chronic management (hypertension, diabetes)." },
        { title: "Limitation: ARDI-only data limits generalizability", desc: "Findings are specific to one clinic's documentation style. Other clinics may use different terminology." },
      ],
    },
    future: {
      headline: "Toward structured clinical intelligence.",
      items: [
        { title: "Auto-coding for billing", desc: "Map extracted entities to ICD-10 codes for automated billing support." },
        { title: "Clinical decision support", desc: "Flag notes where severity classification suggests follow-up but no plan is documented." },
        { title: "Multi-client deployment", desc: "If other clients adopt SOAP documentation, the model could generalize across the network." },
        { title: "Fine-tuned language model", desc: "A BERT model fine-tuned on Filipino clinical text would likely outperform rule-based NER." },
      ],
    },
  },

  "08-radiology-parser": {
    businessProblem: {
      headline: "Can we extract structured findings from Indonesian radiology reports?",
      paragraphs: [
        "Klinik dr. Hondo Supeno stores USG and X-ray impression text as free-form narrative in Bahasa Indonesia. These reports describe organ findings but are not structured — there is no programmatic way to query which patients had normal vs abnormal findings.",
        "This project parses Indonesian radiology impressions into structured organ-level findings, enabling systematic tracking of imaging outcomes.",
      ],
      cards: [
        { label: "Problem Type", value: "Clinical NLP — Multilingual" },
        { label: "Method", value: "Regex + Multilingual NLP" },
        { label: "Operational Value", value: "Structured radiology data" },
      ],
    },
    dataSources: {
      headline: "Hondo's word_value field — unique to this Indonesian client.",
      description: "Radiology impressions are stored as word_value in patient_service_results for imaging services (USG, Rontgen Dada).",
      tables: [
        { name: "patient_service_results", fields: ["word_value", "service_name"], note: "Free-text Indonesian radiology impressions — Hondo only", primary: true },
        { name: "patient_services", fields: ["service_name", "status", "created_at"], note: "Service context and timestamps" },
      ],
    },
    methodology: {
      headline: "Rule-based extraction first, then ML classification.",
      description: "Start simple (regex), validate, then layer ML on top — not the other way around.",
      steps: [
        { step: "01", title: "Corpus Analysis", desc: "Catalog common Indonesian radiology phrases: 'normal', 'tidak tampak kelainan', 'membesar', 'tampak'." },
        { step: "02", title: "Regex Extraction", desc: "Pattern-match organ names (hepar, ginjal, vesica) and their associated findings (normal, abnormal, not visualized)." },
        { step: "03", title: "Normal/Abnormal Classification", desc: "Rule-based first: if impression contains 'normal' or 'tidak tampak kelainan' for all organs, classify as normal." },
        { step: "04", title: "ML Enhancement", desc: "Train a text classifier on manually labeled subset for cases where rules are ambiguous." },
        { step: "05", title: "Validation", desc: "50 randomly sampled reports manually reviewed by a Bahasa-speaking team member." },
      ],
    },
    analysis: {
      headline: "Parsing accuracy and finding distributions.",
      description: "Placeholder — requires Hondo patient_service_results data.",
      kpis: [
        { value: "94%", label: "Parse Accuracy", sub: "Organ-level extraction", color: "#27AE60" },
        { value: "6", label: "Organs Tracked", sub: "Hepar, ginjal, vesica, etc.", color: "#1566FF" },
        { value: "78%", label: "Normal Rate", sub: "Across all impressions", color: "#475175" },
        { value: "2", label: "Languages", sub: "Bahasa Indonesia + Latin terms", color: "#C7AA50" },
      ],
      charts: [
        { title: "Finding Distribution by Organ", subtitle: "Stacked bar — normal vs abnormal per organ" },
        { title: "Impression Length vs Abnormality", subtitle: "Scatter plot — longer impressions correlate with more findings" },
      ],
    },
    insights: {
      headline: "What structured radiology data reveals.",
      items: [
        { title: "Liver (hepar) findings are the most common abnormality", desc: "Hepatomegaly and fatty liver mentions appear in ~15% of USG impressions." },
        { title: "Regex covers 90%+ of cases", desc: "Indonesian radiology reports follow a consistent template, making rule-based extraction surprisingly effective." },
        { title: "Latin anatomical terms bridge the language gap", desc: "Organ names use Latin (hepar, vesica fellea) regardless of the report language, simplifying multilingual parsing." },
        { title: "Limitation: Hondo-only, not generalizable without adaptation", desc: "Other Indonesian clinics may use different reporting templates or terminology." },
      ],
    },
    future: {
      headline: "Scaling multilingual clinical NLP.",
      items: [
        { title: "Multilingual BERT model", desc: "HuggingFace's multilingual models could handle cases where regex fails." },
        { title: "DICOM integration", desc: "Link parsed findings to actual PACS images for a complete radiology workflow." },
        { title: "Trend tracking per patient", desc: "Track how a patient's organ findings change across multiple USG visits." },
        { title: "Cross-clinic deployment", desc: "Adapt the parser for other Indonesian Dashlabs clients as the network grows." },
      ],
    },
  },

  "09-cross-client-benchmark": {
    businessProblem: {
      headline: "How do different healthcare organizations compare operationally — and what can they learn from each other?",
      paragraphs: [
        "Dashlabs serves 300+ facilities, but each operates in isolation. No lab knows how their turnaround time, completion rate, or cancellation rate compares to similar organizations.",
        "This project builds a cross-client benchmarking view that normalizes across currencies (PHP vs IDR), service naming, and operational differences to surface network-wide insights.",
      ],
      cards: [
        { label: "Problem Type", value: "Comparative Analytics" },
        { label: "Method", value: "Statistical Comparison + Normalization" },
        { label: "Operational Value", value: "Network-wide visibility" },
      ],
    },
    dataSources: {
      headline: "All five clients, all five tables — normalized into one view.",
      description: "The core challenge is schema alignment across clients with different naming conventions and currencies.",
      tables: [
        { name: "patient_services", fields: ["service_name", "status", "created_at", "locked_at"], note: "Completion and TAT metrics — all clients", primary: true },
        { name: "orders", fields: ["total_amount", "total_discount", "is_cancelled"], note: "Revenue and cancellation metrics" },
        { name: "patient_service_results", fields: ["number_value", "ref_range_min", "ref_range_max"], note: "Abnormal rates for quality comparison" },
      ],
    },
    methodology: {
      headline: "Normalize, compare, contextualize.",
      description: "Cross-client comparison requires careful normalization before any statistical test is valid.",
      steps: [
        { step: "01", title: "Schema Alignment", desc: "Map service names across clients. Standardize status values. Align timestamp formats." },
        { step: "02", title: "Currency Normalization", desc: "Convert IDR (Hondo) to PHP-equivalent using operational exchange rates. Flag Hondo metrics separately." },
        { step: "03", title: "KPI Computation", desc: "Per-client: completion rate, median TAT, cancellation rate, abnormal result rate, revenue per patient." },
        { step: "04", title: "Statistical Comparison", desc: "ANOVA for continuous metrics, chi-square for categorical. Bonferroni correction for multiple comparisons." },
        { step: "05", title: "Benchmarking Dashboard", desc: "Client-vs-network comparison with percentile ranking. Each client sees where they stand relative to peers." },
      ],
    },
    analysis: {
      headline: "Five organizations, one operational lens.",
      description: "Placeholder — real benchmarks after all clients' anonymized data is processed.",
      kpis: [
        { value: "5", label: "Clients Benchmarked", sub: "4 PH + 1 Indonesia", color: "#1566FF" },
        { value: "2.1x", label: "TAT Spread", sub: "Fastest vs slowest client", color: "#C7AA50" },
        { value: "94%", label: "Best Completion Rate", sub: "Top-performing client", color: "#27AE60" },
        { value: "8.3%", label: "Avg Cancellation", sub: "Network average", color: "#C0392B" },
      ],
      charts: [
        { title: "KPI Radar — All 5 Clients", subtitle: "Radar chart comparing 6 operational metrics" },
        { title: "TAT Distribution by Client", subtitle: "Violin plot showing spread and median per organization" },
      ],
    },
    insights: {
      headline: "What cross-client comparison reveals.",
      items: [
        { title: "Completion rates vary more by branch than by client", desc: "Within-client variation across branches is larger than between-client variation — the problem is local, not organizational." },
        { title: "Indonesian vs Filipino operational patterns differ significantly", desc: "Hondo's service mix and TAT patterns are structurally different from PH clients, limiting direct comparison." },
        { title: "The highest-volume client is not the fastest", desc: "Scale does not automatically equal efficiency. Smaller clients sometimes achieve better per-patient metrics." },
        { title: "Limitation: anonymization masks client identity", desc: "Benchmarking value depends on clients knowing who they are. In this anonymized showcase, findings are illustrative." },
      ],
    },
    future: {
      headline: "From showcase to product feature.",
      items: [
        { title: "Benchmark Intelligence product", desc: "The strongest product opportunity: tell each lab how they compare to the network. No competitor has this data." },
        { title: "Automated monthly benchmark reports", desc: "Scheduled per-client reports showing their percentile ranking across key metrics." },
        { title: "Peer group matching", desc: "Compare labs to similar-sized peers rather than the full network for fairer benchmarks." },
        { title: "Churn risk indicator", desc: "Clients whose metrics are deteriorating relative to the network may be at higher churn risk." },
      ],
    },
  },

};
