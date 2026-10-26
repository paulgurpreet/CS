```
#!/usr/bin/env python3
"""
run_experiments.py -- What predicts large funding rounds for Indian start-ups?
Regenerates every number, table and figure used in the paper.

Usage:  python run_experiments.py startup_funding.csv [outdir]
Needs:  pandas numpy scikit-learn matplotlib scipy
"""
import sys, re, json, warnings, os
import numpy as np, pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler, KBinsDiscretizer
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.naive_bayes import BernoulliNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import GridSearchCV, TimeSeriesSplit
from sklearn.metrics import (balanced_accuracy_score, matthews_corrcoef, accuracy_score, precision_score, recall_score,
                             f1_score, roc_auc_score, roc_curve, silhouette_score,
                             confusion_matrix)
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

warnings.filterwarnings("ignore")
SEED = 42
np.random.seed(SEED)
CSV = sys.argv[1] if len(sys.argv) > 1 else "startup_funding.csv"
OUT = sys.argv[2] if len(sys.argv) > 2 else "."
FIG = os.path.join(OUT, "figs"); os.makedirs(FIG, exist_ok=True)
R = {}   # results dictionary -> results.json

plt.rcParams.update({"font.size": 8, "axes.spines.top": False, "axes.spines.right": False,
                     "axes.titlesize": 8, "axes.labelsize": 8, "legend.fontsize": 7,
                     "figure.dpi": 200, "savefig.bbox": "tight"})
C1, C2, C3, C4 = "#1f4e79", "#c0504d", "#4f9d69", "#e08e0b"

# ---------------------------------------------------------------- 1. LOAD + CLEAN
raw = pd.read_csv(CSV)
raw.columns = ["sr", "date", "startup", "vert", "subvert", "city", "investors", "itype", "amt", "remarks"]
R["n_raw"] = len(raw)

def txt(s):
    """text cleaning: remove literal escape artefacts, collapse whitespace"""
    if pd.isna(s): return np.nan
    s = str(s)
    for bad in ["\\xc2\\xa0", "\\\\xc2\\\\xa0", "\\xe2\\x80\\x99", "\\n", "\\\\n"]:
        s = s.replace(bad, " ")
    s = re.sub(r"\s+", " ", s).strip()
    return s if s else np.nan

for c in ["vert", "city", "itype", "amt", "investors", "startup", "date"]:
    raw[c] = raw[c].map(txt)

def parse_date(s):
    m = re.match(r"^(\d{1,2})\D+(\d{1,2})\D*(\d{2,4})$", str(s))
    if not m: return pd.NaT
    d, mo, y = m.groups()
    y = "20" + y[-2:] if len(y) < 4 else y
    return pd.to_datetime(f"{d}/{mo}/{y}", format="%d/%m/%Y", errors="coerce")

raw["dt"] = raw["date"].map(parse_date)
R["n_bad_dates"] = int(raw["dt"].isna().sum())
raw["amount"] = pd.to_numeric(raw["amt"].str.replace(r"[,+]", "", regex=True), errors="coerce")
R["n_amount_missing"] = int(raw["amount"].isna().sum())
R["pct_amount_missing"] = round(100 * raw["amount"].isna().mean(), 1)
R["pct_missing"] = {k: round(100 * raw[k].isna().mean(), 1)
                    for k in ["vert", "subvert", "city", "investors", "itype", "amt"]}

def canon_city(s):
    if pd.isna(s): return "Unknown"
    s = re.split(r"\s*/\s*", s)[0].strip().title()
    s = {"Bangalore": "Bengaluru", "Gurgaon": "Gurugram", "New Delhi": "Delhi",
         "Bengaluru": "Bengaluru"}.get(s, s)
    return s

def canon_type(s):
    if pd.isna(s): return "Unknown"
    t = s.lower()
    if "pre" in t and "series a" in t: return "Pre-Series A"
    if re.search(r"series\s*a\b", t): return "Series A"
    if re.search(r"series\s*b\b", t): return "Series B"
    if re.search(r"series\s*[c-h]\b", t): return "Series C+"
    if "debt" in t: return "Debt"
    if "seed" in t or "angel" in t or "angle" in t or "maiden" in t: return "Seed/Angel"
    if "private equity" in t or t in ("equity", "venture", "venture round") or "equity" in t: return "Private Equity"
    if "crowd" in t: return "Crowdfunding"
    return "Other"

SECTOR_RULES = [  # (sector, keyword regex) -- first match wins
    ("E-commerce", r"e-?commerce|marketplace|online retail|e-?tailer|online shop"),
    ("FinTech", r"fin-?tech|financ|payment|wallet|lending|insur|bank|loan"),
    ("EdTech", r"ed-?tech|e-tech|educat|learning|coaching|tutor"),
    ("Healthcare", r"health|medic|pharma|fitness|diagnos|wellness"),
    ("Food & Beverage", r"food|beverage|restaurant|grocery|fmcg|kitchen|dining"),
    ("Logistics & Transport", r"logist|transport|mobility|cab|ride|shipping|supply chain|automobile|vehicle|car "),
    ("Travel & Hospitality", r"travel|hotel|hospitality|tourism|vacation"),
    ("Real Estate", r"real estate|property|housing|rental"),
    ("Media & Gaming", r"media|gaming|game|entertain|music|video|social|content"),
    ("Agri & Clean-tech", r"agri|farm|energy|solar|clean|waste|water|environment"),
    ("Consumer Internet", r"consumer internet"),
    ("Technology", r"^technology$|^tech$|\bit\b|software|saas|analytics|big data|iot|internet of things|artificial|\bai\b|cloud|cyber|information tech|platform|b2b"),
    ("Services", r"service|jobs?|recruit|handyman|hyper-?local|lifestyle|fashion|beauty|apparel|furniture"),
]

def canon_sector(s):
    if pd.isna(s): return "Unknown"
    t = s.lower()
    for name, pat in SECTOR_RULES:
        if re.search(pat, t): return name
    return "Other"

raw["City"] = raw["city"].map(canon_city)
raw["Type"] = raw["itype"].map(canon_type)
raw["Sector"] = raw["vert"].map(canon_sector)
raw["Year"] = raw["dt"].dt.year
R["n_city_raw"] = int(raw["city"].nunique()); R["n_city_clean"] = int(raw["City"].nunique())
R["n_type_raw"] = int(raw["itype"].nunique()); R["n_type_clean"] = int(raw["Type"].nunique())
R["n_vert_raw"] = int(raw["vert"].str.lower().nunique()); R["n_sector_clean"] = int(raw["Sector"].nunique())

df = raw.dropna(subset=["amount", "dt"]).copy()
df = df[df["amount"] > 0]
before = len(df)
df = df.drop_duplicates(subset=["dt", "startup", "investors", "amount"])
R["n_dups_dropped"] = before - len(df)
df = df.sort_values("dt").reset_index(drop=True)
R["n_model"] = len(df)
R["year_counts"] = {int(k): int(v) for k, v in df["Year"].value_counts().sort_index().items()}
R["year_median"] = {int(k): float(v) for k, v in df.groupby("Year")["amount"].median().items()}
R["amount_summary"] = {k: float(v) for k, v in df["amount"].describe().items()}
R["top_cities_deals"] = df["City"].value_counts().head(8).to_dict()

# --- concentration statistics
tot = df["amount"].sum()
ncr = {"Delhi", "Gurugram", "Noida", "Faridabad", "Ghaziabad"}
cityg = df["City"].where(~df["City"].isin(ncr), "Delhi-NCR")
R["share_deals"] = {k: round(100 * (cityg == k).mean(), 1) for k in ["Bengaluru", "Delhi-NCR", "Mumbai"]}
R["share_funding"] = {k: round(100 * df.loc[cityg == k, "amount"].sum() / tot, 1) for k in ["Bengaluru", "Delhi-NCR", "Mumbai"]}
top3 = ["Bengaluru", "Delhi-NCR", "Mumbai"]
R["share_deals_top3"] = round(100 * cityg.isin(top3).mean(), 1)
R["share_funding_top3"] = round(100 * df.loc[cityg.isin(top3), "amount"].sum() / tot, 1)
k1 = max(1, int(round(0.01 * len(df))))
R["top1pct_n"] = k1
R["top1pct_share_funding"] = round(100 * df["amount"].nlargest(k1).sum() / tot, 1)
R["share_funding_by_type"] = {k: round(100 * v / tot, 1) for k, v in df.groupby("Type")["amount"].sum().sort_values(ascending=False).items()}
R["type_counts"] = df["Type"].value_counts().to_dict()
R["sector_counts"] = df["Sector"].value_counts().to_dict()

# ---------------------------------------------------------------- 2. SPLIT + TARGET
TEST_FROM = 2018
train = df[df["Year"] < TEST_FROM].copy()
test = df[df["Year"] >= TEST_FROM].copy()
MEDIAN = float(train["amount"].median())            # threshold fixed on training data only
for d in (train, test):
    d["large"] = (d["amount"] > MEDIAN).astype(int)
R["n_train"], R["n_test"] = len(train), len(test)
R["median_train"] = MEDIAN
R["median_all"] = float(df["amount"].median())
R["rate_train"] = round(100 * train["large"].mean(), 1)
R["rate_test"] = round(100 * test["large"].mean(), 1)
R["test_years"] = f"{int(test['Year'].min())}-{test['dt'].max().strftime('%b %Y')}"
CAT = ["City", "Type", "Sector"]; NUM = ["Year"]; FEATS = CAT + NUM
Xtr, ytr, Xte, yte = train[FEATS], train["large"].values, test[FEATS], test["large"].values
R["type_test_share"] = test["Type"].value_counts().to_dict()
R["type_train_share"] = train["Type"].value_counts().to_dict()

def prep(kind="std", cats=CAT, num=NUM):
    ohe = OneHotEncoder(handle_unknown="infrequent_if_exist", min_frequency=10)
    tr = [("cat", ohe, cats)] if cats else []
    if num:
        tr.append(("num", StandardScaler() if kind == "std" else
                   KBinsDiscretizer(n_bins=3, encode="onehot", strategy="uniform"), num))
    return ColumnTransformer(tr)

MODELS = {
    "Logistic regression": (LogisticRegression(max_iter=2000, random_state=SEED), "std",
                            {"clf__C": [0.01, 0.1, 1, 10], "clf__class_weight": [None, "balanced"]}),
    "Decision tree": (DecisionTreeClassifier(random_state=SEED), "std",
                      {"clf__max_depth": [2, 3, 4, 6, 8], "clf__min_samples_leaf": [5, 20], "clf__class_weight": [None, "balanced"]}),
    "Naive Bayes (Bernoulli)": (BernoulliNB(), "bins",
                                {"clf__alpha": [0.1, 0.5, 1.0, 2.0]}),
    "k-NN": (KNeighborsClassifier(), "std",
             {"clf__n_neighbors": [5, 15, 31, 61], "clf__weights": ["uniform", "distance"]}),
}
tscv = TimeSeriesSplit(n_splits=5)

def metrics(y, pred, proba):
    return dict(acc=accuracy_score(y, pred), bacc=balanced_accuracy_score(y, pred), mcc=matthews_corrcoef(y, pred),
                prec=precision_score(y, pred, zero_division=0),
                rec=recall_score(y, pred), f1=f1_score(y, pred),
                auc=(roc_auc_score(y, proba) if proba is not None and len(set(y)) > 1 else np.nan))

def boot_ci(y, pred, proba, n=1000):
    rng = np.random.default_rng(SEED); f, a = [], []
    for _ in range(n):
        i = rng.integers(0, len(y), len(y))
        if len(set(y[i])) < 2: continue
        f.append(f1_score(y[i], pred[i]))
        if proba is not None: a.append(roc_auc_score(y[i], proba[i]))
    ci = lambda v: (float(np.percentile(v, 2.5)), float(np.percentile(v, 97.5))) if v else (np.nan, np.nan)
    return ci(f), ci(a)

results, fitted, roc = {}, {}, {}
# --- baselines
for nm, v in [("Always 'small'", 0), ("Always 'large'", 1)]:
    pm = np.full(len(yte), v)
    results[nm] = {**metrics(yte, pm, None), "cv_f1": np.nan, "best": "constant prediction",
                   "f1_ci": boot_ci(yte, pm, None)[0], "auc_ci": (np.nan, np.nan)}
rate_by_type = train.groupby("Type")["large"].mean()
R["train_rate_by_type"] = {k: round(float(v), 3) for k, v in rate_by_type.items()}
R["test_rate_by_type"] = {k: round(float(v), 3) for k, v in test.groupby("Type")["large"].mean().items()}
pt = test["Type"].map(rate_by_type).fillna(ytr.mean()).values   # unseen types -> global training rate
results["Type-lookup rule"] = {**metrics(yte, (pt >= 0.5).astype(int), pt), "cv_f1": np.nan,
                               "best": "train majority class per investment type",
                               "f1_ci": boot_ci(yte, (pt >= .5).astype(int), pt)[0],
                               "auc_ci": boot_ci(yte, (pt >= .5).astype(int), pt)[1]}
roc["Type-lookup rule"] = roc_curve(yte, pt)[:2]
# --- learned models
for name, (est, kind, grid) in MODELS.items():
    pipe = Pipeline([("prep", prep(kind)), ("clf", est)])
    gs = GridSearchCV(pipe, grid, scoring="f1", cv=tscv, n_jobs=1).fit(Xtr, ytr)
    best = gs.best_estimator_
    pred = best.predict(Xte); proba = best.predict_proba(Xte)[:, 1]
    fci, aci = boot_ci(yte, pred, proba)
    results[name] = {**metrics(yte, pred, proba), "cv_f1": float(gs.best_score_),
                     "best": ", ".join(f"{k.split('__')[1]}={v}" for k, v in gs.best_params_.items()),
                     "f1_ci": fci, "auc_ci": aci, "cm": confusion_matrix(yte, pred).tolist()}
    fitted[name] = (best, gs.best_params_)
    roc[name] = roc_curve(yte, proba)[:2]
R["clf"] = results
R["grids"] = {k: {kk.split("__")[1]: vv for kk, vv in v[2].items()} for k, v in MODELS.items()}

# ---------------------------------------------------------------- 3. INTERPRETATION
lr = fitted["Logistic regression"][0]
names = lr.named_steps["prep"].get_feature_names_out()
coef = lr.named_steps["clf"].coef_[0]
order = np.argsort(coef)
clean_names = [n.replace("cat__", "").replace("num__", "").replace("_", " = ", 1) for n in names]
R["lr_top_pos"] = [(clean_names[i], float(coef[i]), float(np.exp(coef[i]))) for i in order[::-1][:8]]
R["lr_top_neg"] = [(clean_names[i], float(coef[i]), float(np.exp(coef[i]))) for i in order[:8]]
dt_best = fitted["Decision tree"][0]
R["tree_rules"] = export_text(dt_best.named_steps["clf"], feature_names=list(
    dt_best.named_steps["prep"].get_feature_names_out()), max_depth=3)
dtn = dt_best.named_steps["clf"]
imp = pd.Series(dtn.feature_importances_, index=dt_best.named_steps["prep"].get_feature_names_out())
imp.index = [i.replace("cat__", "").replace("num__", "") for i in imp.index]
R["tree_top_imp"] = imp.sort_values(ascending=False).head(6).round(3).to_dict()

# --- slice: test rounds whose investment type was seen in training (PE / Seed-Angel)
known = test["Type"].isin(["Private Equity", "Seed/Angel"]).values
R["n_test_known"] = int(known.sum())
R["known_slice"] = {}
for nm in MODELS:
    b = fitted[nm][0]; pr = b.predict_proba(Xte[known])[:, 1]
    R["known_slice"][nm] = metrics(yte[known], (pr >= 0.5).astype(int), pr)
R["known_slice"]["Type-lookup rule"] = metrics(yte[known], (pt[known] >= 0.5).astype(int), pt[known])
R["known_slice"]["Always 'large'"] = metrics(yte[known], np.ones(known.sum(), int), None)
R["new_type_share_large"] = round(float(yte[~known].mean()), 3); R["n_test_newtype"] = int((~known).sum())

# --- what predicts size *within* an investment type? (city + sector + year only)
R["within_type"] = {}
for t in ["Private Equity", "Seed/Angel"]:
    a = train["Type"] == t; b_ = test["Type"] == t
    p = Pipeline([("prep", prep("std", ["City", "Sector"], ["Year"])), ("clf", LogisticRegression(C=1.0, max_iter=2000, random_state=SEED))])
    p.fit(train.loc[a, FEATS], train.loc[a, "large"])
    pr = p.predict_proba(test.loc[b_, FEATS])[:, 1]
    yy = test.loc[b_, "large"].values
    rng = np.random.default_rng(SEED); bs = []
    for _ in range(1000):
        i = rng.integers(0, len(yy), len(yy))
        if len(set(yy[i])) == 2: bs.append(roc_auc_score(yy[i], pr[i]))
    R["within_type"][t] = dict(n_train=int(a.sum()), n_test=int(b_.sum()), rate_train=float(train.loc[a, "large"].mean()),
                               rate_test=float(yy.mean()), auc=float(roc_auc_score(yy, pr)), ci=[float(np.percentile(bs, 2.5)), float(np.percentile(bs, 97.5))])

# feature-group ablation (refit with the tuned logistic-regression hyper-parameters)
lr_params = {k.split("__")[1]: v for k, v in fitted["Logistic regression"][1].items()}
groups = {"City": ["City"], "Investment type": ["Type"], "Sector": ["Sector"], "Year": ["Year"]}
abl = {}
def run_lr(cats, num):
    pipe = Pipeline([("prep", prep("std", cats, num)),
                     ("clf", LogisticRegression(max_iter=2000, random_state=SEED, **lr_params))])
    from sklearn.model_selection import cross_val_score
    cvf = cross_val_score(pipe, Xtr, ytr, cv=tscv, scoring="f1").mean()
    cva = cross_val_score(pipe, Xtr, ytr, cv=tscv, scoring="roc_auc").mean()
    pipe.fit(Xtr, ytr); pr = pipe.predict_proba(Xte)[:, 1]
    m = metrics(yte, (pr >= .5).astype(int), pr)
    return dict(f1=m["f1"], auc=m["auc"], cv_f1=float(cvf), cv_auc=float(cva))
abl["All four features"] = run_lr(CAT, NUM)
for g, cols in groups.items():
    cats = [c for c in CAT if c not in cols]; num = [c for c in NUM if c not in cols]
    abl[f"Without {g}"] = run_lr(cats, num)
for g, cols in groups.items():
    abl[f"Only {g}"] = run_lr([c for c in CAT if c in cols], [c for c in NUM if c in cols])
R["ablation"] = abl

# sensitivity: threshold = pooled median of all rounds (instead of training median)
m_all = R["median_all"]
ytr2 = (train["amount"] > m_all).astype(int).values; yte2 = (test["amount"] > m_all).astype(int).values
pipe2 = Pipeline([("prep", prep("std")), ("clf", LogisticRegression(max_iter=2000, random_state=SEED, **lr_params))]).fit(Xtr, ytr2)
p2 = pipe2.predict_proba(Xte)[:, 1]
R["sens_pooled_median"] = {**metrics(yte2, (p2 >= .5).astype(int), p2), "rate_test": round(100 * yte2.mean(), 1)}

# ---------------------------------------------------------------- 4. CLUSTERING OF SECTORS
cl = df.copy()
cl["large"] = (cl["amount"] > MEDIAN).astype(int)
cl["la"] = np.log10(cl["amount"])
cl["cg"] = cityg.values
cl["seed"] = (cl["Type"] == "Seed/Angel").astype(int)
cl = cl[~cl["Sector"].isin(["Unknown", "Other"])]
g = cl.groupby("Sector")
prof = pd.DataFrame({
    "n": g.size(), "med_log": g["la"].median(), "sd_log": g["la"].std(),
    "large_share": g["large"].mean(), "seed_share": g["seed"].mean(),
    "blr_share": g.apply(lambda d: (d["cg"] == "Bengaluru").mean()),
    "ncr_share": g.apply(lambda d: (d["cg"] == "Delhi-NCR").mean()),
})
prof = prof[prof["n"] >= 10].copy()
prof["log_n"] = np.log10(prof["n"])
CF = ["med_log", "sd_log", "large_share", "seed_share", "blr_share", "ncr_share", "log_n"]
Z = StandardScaler().fit_transform(prof[CF])
sil, inertia = {}, {}
for k in range(2, min(7, len(prof) // 2 + 1)):
    km = KMeans(n_clusters=k, n_init=50, random_state=SEED).fit(Z)
    sil[k] = float(silhouette_score(Z, km.labels_)); inertia[k] = float(km.inertia_)
K = max(sil, key=sil.get)
km = KMeans(n_clusters=K, n_init=50, random_state=SEED).fit(Z)
prof["cluster"] = km.labels_
R["n_sectors_clustered"] = len(prof); R["sil"] = sil; R["inertia"] = inertia; R["K"] = int(K)
R["clusters"] = {}
for c in range(K):
    sub = prof[prof["cluster"] == c]
    R["clusters"][int(c)] = dict(
        sectors=list(sub.index), n_deals=int(sub["n"].sum()),
        med_amount=float(10 ** sub["med_log"].median()), large_share=float(sub["large_share"].mean()),
        seed_share=float(sub["seed_share"].mean()), blr=float(sub["blr_share"].mean()),
        ncr=float(sub["ncr_share"].mean()), sd_log=float(sub["sd_log"].mean()))
# stability: share of 20 random restarts giving the same partition (ARI)
from sklearn.metrics import adjusted_rand_score
aris = [adjusted_rand_score(km.labels_, KMeans(n_clusters=K, n_init=1, random_state=s).fit(Z).labels_) for s in range(20)]
R["cluster_ari_mean"] = float(np.mean(aris))
prof.round(3).to_csv(os.path.join(OUT, "sector_profiles.csv"))

# ---------------------------------------------------------------- 5. FIGURES
def save(name): plt.savefig(os.path.join(FIG, name + ".pdf")); plt.close()

# Fig 1: deals & median per year
fig, ax = plt.subplots(figsize=(3.4, 2.1))
yrs = sorted(R["year_counts"]); ax.bar([str(y) for y in yrs], [R["year_counts"][y] for y in yrs], color=C1)
ax.set_ylabel("Rounds with disclosed amount"); ax2 = ax.twinx(); ax2.spines["right"].set_visible(True)
ax2.plot([str(y) for y in yrs], [R["year_median"][y] / 1e6 for y in yrs], "o-", color=C2)
ax2.set_ylabel("Median round (USD m)", color=C2); ax.set_xlabel("Year"); save("fig1_years")

# Fig 2: amount distribution + by type
fig, axs = plt.subplots(1, 2, figsize=(3.4, 2.0), gridspec_kw={"width_ratios": [1, 1.25]})
axs[0].hist(np.log10(df["amount"]), bins=30, color=C1)
axs[0].axvline(np.log10(MEDIAN), color=C2, ls="--"); axs[0].set_xlabel("log$_{10}$ amount (USD)"); axs[0].set_ylabel("Rounds")
ts = [t for t in ["Seed/Angel", "Private Equity", "Series A", "Series B", "Series C+", "Debt"] if (df["Type"] == t).sum() >= 5]
axs[1].boxplot([np.log10(df.loc[df["Type"] == t, "amount"]) for t in ts], vert=False,
               showfliers=False, medianprops=dict(color=C2))
axs[1].set_yticklabels(ts)   # works on old and new matplotlib
axs[1].axvline(np.log10(MEDIAN), color=C2, ls="--", lw=0.8); axs[1].set_xlabel("log$_{10}$ amount (USD)")
plt.tight_layout(); save("fig2_amount")

# Fig 3: large share by city and sector (all years, training median)
dd = df.copy(); dd["large"] = (dd["amount"] > MEDIAN).astype(int); dd["cg"] = cityg.values
fig, axs = plt.subplots(1, 2, figsize=(3.45, 2.2))
cs = dd["cg"].value_counts().head(7).index
s1 = dd[dd["cg"].isin(cs)].groupby("cg")["large"].mean().sort_values()
axs[0].barh(s1.index, 100 * s1.values, color=C1); axs[0].set_xlabel("% large rounds"); axs[0].set_title("City")
ss = dd["Sector"].value_counts(); ss = ss[(ss >= 25) & (~ss.index.isin(["Unknown", "Other"]))].index
s2 = dd[dd["Sector"].isin(ss)].groupby("Sector")["large"].mean().sort_values()
axs[1].barh(s2.index, 100 * s2.values, color=C4); axs[1].set_xlabel("% large rounds"); axs[1].set_title("Sector")
for a in axs: a.axvline(50, color="grey", ls=":", lw=0.8)
plt.tight_layout(); save("fig3_share")

# Fig 4: pipeline diagram
fig, ax = plt.subplots(figsize=(3.4, 3.9)); ax.axis("off"); ax.set_xlim(0, 10); ax.set_ylim(0, 12.6)
steps = [("1  Raw data", "startup_funding.csv, 3,044 rows"),
         ("2  Cleaning", "fix dates/amounts, text clean, merge\ncity / type / sector spellings"),
         ("3  Split by time", "train 2015-17 | test 2018-20\nlabel: amount > train median"),
         ("4  Pipeline (fit on train)", "one-hot (rare levels pooled), scale year"),
         ("5  Models + CV", "LR, tree, NB, k-NN; 5-fold\nforward-chaining CV, F1"),
         ("6  Evaluation + clustering", "Acc, F1, AUC, 95% CI | k-means, silhouette")]
for i, (t, s) in enumerate(steps):
    y = 11.4 - i * 2.05
    ax.add_patch(FancyBboxPatch((0.2, y - 0.75), 9.6, 1.65, boxstyle="round,pad=0.02", fc="#f4f6f9", ec=C1, lw=0.8))
    ax.text(0.5, y + 0.45, t, fontsize=7.2, weight="bold", va="center")
    ax.text(0.5, y - 0.28, s, fontsize=6.2, va="center", color="#333")
    if i < len(steps) - 1: ax.annotate("", (5, y - 0.95), (5, y - 0.78), arrowprops=dict(arrowstyle="-|>", color=C1, lw=0.8))
save("fig4_pipeline")

# Fig 5: ROC
fig, ax = plt.subplots(figsize=(3.3, 2.7))
cols = {"Logistic regression": C1, "Decision tree": C2, "Naive Bayes (Bernoulli)": C3, "k-NN": C4, "Type-lookup rule": "grey"}
for n, (fpr, tpr) in roc.items():
    if n == "k-NN": continue   # omitted: tuned k differs across library versions; AUC is in the table
    ax.plot(fpr, tpr, color=cols[n], lw=1.3, ls="--" if n == "Type-lookup rule" else "-",
            label=f"{n} ({results[n]['auc']:.3f})")
ax.plot([0, 1], [0, 1], ":", color="k", lw=0.6); ax.set_xlabel("False-positive rate"); ax.set_ylabel("True-positive rate")
ax.legend(loc="lower right", frameon=False); save("fig5_roc")

# Fig 6: LR coefficients
sel = list(order[:7]) + list(order[::-1][:7])[::-1]
sel = sorted(set(sel), key=lambda i: coef[i])
fig, ax = plt.subplots(figsize=(3.4, 2.9))
ax.barh([clean_names[i] for i in sel], [coef[i] for i in sel], color=[C1 if coef[i] > 0 else C2 for i in sel])
ax.axvline(0, color="k", lw=0.6); ax.set_xlabel("Coefficient (log-odds of a large round)", fontsize=7)
ax.tick_params(axis="y", labelsize=6.5); save("fig6_coef")

# Fig 7: ablation
fig, ax = plt.subplots(figsize=(3.4, 2.4))
keys = ["All four features"] + [f"Without {g}" for g in groups] + [f"Only {g}" for g in groups]
ax.barh(keys[::-1], [abl[k]["auc"] for k in keys[::-1]],
        color=[C2 if k.startswith("Only") else (C1 if k.startswith("All") else C4) for k in keys[::-1]])
ax.set_xlim(0.45, max(0.9, max(abl[k]["auc"] for k in keys) + 0.05)); ax.set_xlabel("Test ROC-AUC")
ax.axvline(0.5, color="grey", ls=":", lw=0.8); ax.tick_params(axis="y", labelsize=6.5); save("fig7_ablation")

# Fig 8: silhouette + elbow
fig, ax = plt.subplots(figsize=(3.3, 2.0))
ks = sorted(sil); ax.plot(ks, [sil[k] for k in ks], "o-", color=C1); ax.set_xlabel("Number of clusters k")
ax.set_ylabel("Silhouette", color=C1); ax2 = ax.twinx(); ax2.spines["right"].set_visible(True)
ax2.plot(ks, [inertia[k] for k in ks], "s--", color=C2, ms=3); ax2.set_ylabel("Inertia", color=C2); save("fig8_k")

# Fig 9: PCA of sectors
pc = PCA(2, random_state=SEED).fit(Z); P = pc.transform(Z)
R["pca_var"] = [float(v) for v in pc.explained_variance_ratio_]
fig, ax = plt.subplots(figsize=(3.45, 2.9))
pal = [C1, C2, C3, C4, "#7b4f9d", "#555555", "#00a3a3"]
for c in range(K):
    m = (prof["cluster"] == c).values
    ax.scatter(P[m, 0], P[m, 1], s=8 + 6 * prof["log_n"].values[m] ** 2, color=pal[c], alpha=.85, label=f"Cluster {c + 1}")
for i, s in enumerate(prof.index): ax.annotate(s, (P[i, 0], P[i, 1]), fontsize=5.5, xytext=(3, 3), textcoords="offset points")
ax.set_xlabel(f"PC1 ({100 * pc.explained_variance_ratio_[0]:.0f}% var.)"); ax.set_ylabel(f"PC2 ({100 * pc.explained_variance_ratio_[1]:.0f}% var.)")
ax.legend(frameon=False, loc="best"); save("fig9_clusters")

# ---------------------------------------------------------------- 5b. CSV TABLES
T = os.path.join(OUT, "tables_csv"); os.makedirs(T, exist_ok=True)
df[["dt", "startup", "City", "Type", "Sector", "Year", "amount"]].assign(
    large_vs_train_median=(df["amount"] > MEDIAN).astype(int)).to_csv(os.path.join(T, "cleaned_data.csv"), index=False)
rows = []
for n, r in results.items():
    rows.append({"model": n, "accuracy": r["acc"], "balanced_accuracy": r["bacc"], "mcc": r["mcc"], "precision": r["prec"],
                 "recall": r["rec"], "f1": r["f1"], "f1_ci_low": r["f1_ci"][0], "f1_ci_high": r["f1_ci"][1],
                 "roc_auc": r["auc"], "auc_ci_low": r["auc_ci"][0], "auc_ci_high": r["auc_ci"][1],
                 "cv_f1": r["cv_f1"], "selected_params": r["best"]})
pd.DataFrame(rows).round(4).to_csv(os.path.join(T, "classification_results.csv"), index=False)
pd.DataFrame(abl).T.round(4).rename_axis("feature_set").to_csv(os.path.join(T, "ablation.csv"))
pd.DataFrame({"k": list(sil), "silhouette": list(sil.values()), "inertia": [inertia[k] for k in sil]}).round(4).to_csv(
    os.path.join(T, "kmeans_silhouette.csv"), index=False)
pd.DataFrame([{"cluster": int(c) + 1, "sectors": "; ".join(d["sectors"]), "rounds": d["n_deals"],
               "median_usd": d["med_amount"], "large_share": d["large_share"], "seed_share": d["seed_share"],
               "bengaluru_share": d["blr"], "delhi_ncr_share": d["ncr"]} for c, d in R["clusters"].items()]).round(4).to_csv(
    os.path.join(T, "cluster_summary.csv"), index=False)
prof.round(4).rename_axis("sector").to_csv(os.path.join(T, "sector_profiles.csv"))

# ---------------------------------------------------------------- 6. SAVE
def conv(o):
    if isinstance(o, (np.floating, np.integer)): return o.item()
    if isinstance(o, tuple): return list(o)
    return str(o)
json.dump(R, open(os.path.join(OUT, "results.json"), "w"), indent=1, default=conv)
print(json.dumps({k: R[k] for k in ["n_raw", "n_model", "n_train", "n_test", "median_train", "rate_train", "rate_test", "K"]}, indent=1))
for n, r in results.items():
    print(f"{n:26s} acc={r['acc']:.3f} prec={r['prec']:.3f} rec={r['rec']:.3f} f1={r['f1']:.3f} auc={r['auc']:.3f} cvF1={r['cv_f1']:.3f}  {r['best']}")
print("sil", {k: round(v, 3) for k, v in sil.items()})
```
