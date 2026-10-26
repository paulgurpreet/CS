import json, re, os
import pandas as pd
HERE = os.path.dirname(os.path.abspath(__file__))
RES = os.path.join(HERE, '..', 'results')
R = json.load(open(os.path.join(RES, 'results.json')))
def esc(s): return str(s).replace('&','\\&').replace('%','\\%').replace('_','\\_').replace('#','\\#').replace('$','\\$')
f3 = lambda x: '--' if x is None or x != x else f"{x:.3f}"
ci = lambda c: '--' if c is None or c[0] != c[0] else f"[{c[0]:.3f}, {c[1]:.3f}]"
out = []; tabs = []
# ---- Table: classification results (wide)
rows = ["Always 'small'", "Always 'large'", "Type-lookup rule", "Logistic regression", "Decision tree", "Naive Bayes (Bernoulli)", "k-NN"]
best = {k: max(R['clf'][r][k] for r in rows[3:]) for k in ['acc','bacc','mcc','f1','auc']}
t = ["\\begin{table*}[t]\\centering\\footnotesize\\setlength{\\tabcolsep}{4pt}",
     "\\caption{Large-vs-small funding-round classification on the 2018--Jan 2020 test set ($n=377$; 72.9\\% large). CV-F1 is the mean over five forward-chaining folds inside 2015--2017. Best learned-model value in bold; 95\\% bootstrap CIs (1,000 resamples).}\\label{tab:clf}",
     "\\begin{tabular}{lcccccccccc}\\toprule","Model & Acc. & Bal.\\,acc. & MCC & Prec. & Recall & F1 & F1 95\\% CI & AUC & AUC 95\\% CI & CV-F1\\\\\\midrule"]
for r in rows:
    d = R['clf'][r]
    def cell(k):
        s = f3(d[k]); return f"\\textbf{{{s}}}" if (r in rows[3:] and d[k] == best.get(k, -1)) else s
    name = esc(r).replace("'", "'")
    t.append(f"{name} & {cell('acc')} & {cell('bacc')} & {cell('mcc')} & {f3(d['prec'])} & {f3(d['rec'])} & {cell('f1')} & {ci(d['f1_ci'])} & {cell('auc')} & {ci(d['auc_ci'])} & {f3(d['cv_f1'])}\\\\")
t += ["\\bottomrule\\end{tabular}\\end{table*}"]; tabs.append(t)
# ---- Table: hyper-parameters
t = ["\\begin{table}[t]\\centering\\footnotesize","\\caption{Hyper-parameter grids and values selected by five-fold forward-chaining CV (criterion: F1).}\\label{tab:grid}",
     "\\begin{tabular}{L{1.6cm}L{3.2cm}L{2.2cm}}\\toprule Model & Grid searched & Selected\\\\\\midrule"]
PN = {"C":"C","class_weight":"class weight","max_depth":"depth","min_samples_leaf":"min leaf","n_neighbors":"k","weights":"weights","alpha":"alpha"}
def vv(x): return "none" if x is None or x=="None" else str(x)
fmt = lambda g: "; ".join(PN.get(k,k)+" "+", ".join(vv(x) for x in v) for k, v in g.items())
prettysel = lambda b: "; ".join(PN.get(p.split("=")[0],p.split("=")[0])+" "+vv(p.split("=")[1]) for p in b.split(", "))
for m in ["Logistic regression", "Decision tree", "Naive Bayes (Bernoulli)", "k-NN"]:
    t.append(f"{esc(m)} & {esc(fmt(R['grids'][m]))} & {esc(prettysel(R['clf'][m]['best']))}\\\\")
t += ["\\bottomrule\\end{tabular}\\end{table}"]; tabs.append(t)
# ---- Table: ablation
t = ["\\begin{table}[t]\\centering\\footnotesize","\\caption{Feature-group ablation with the tuned logistic regression (same hyper-parameters, refitted). AUC on the test set and mean forward-chaining CV AUC.}\\label{tab:abl}",
     "\\begin{tabular}{lccc}\\toprule Feature set & Test AUC & CV AUC & Test F1\\\\\\midrule"]
for k, d in R['ablation'].items():
    t.append(f"{esc(k)} & {d['auc']:.3f} & {d['cv_auc']:.3f} & {d['f1']:.3f}\\\\")
t += ["\\bottomrule\\end{tabular}\\end{table}"]; tabs.append(t)
# ---- Table: known-type slice
t = ["\\begin{table}[t]\\centering\\footnotesize","\\caption{Test rounds whose investment type was seen in training (Private Equity or Seed/Angel; $n=%d$)}\\label{tab:slice}" % R['n_test_known'],
     "\\begin{tabular}{lcccc}\\toprule Model & Acc. & MCC & F1 & AUC\\\\\\midrule"]
for m in ["Always 'large'", "Type-lookup rule", "Logistic regression", "Decision tree", "Naive Bayes (Bernoulli)", "k-NN"]:
    d = R['known_slice'][m]; t.append(f"{esc(m)} & {d['acc']:.3f} & {d['mcc']:.3f} & {d['f1']:.3f} & {f3(d['auc'])}\\\\")
t += ["\\bottomrule\\end{tabular}\\end{table}"]; tabs.append(t)
# ---- Table: clusters
t = ["\\begin{table*}[t]\\centering\\footnotesize","\\caption{Profile of the two sector clusters ($k=2$). Large, Seed/Angel, Bengaluru and Delhi-NCR are shares of rounds (means over member sectors); the median amount is the median of the sectors' median round sizes.}\\label{tab:clu}",
     "\\begin{tabular}{cL{5.2cm}cccccc}\\toprule Cluster & Sectors & Rounds & Median (USD m) & Large & Seed/Angel & Bengaluru & Delhi-NCR\\\\\\midrule"]
for c, d in R['clusters'].items():
    t.append(f"{int(c)+1} & {esc(', '.join(d['sectors']))} & {d['n_deals']:,} & {d['med_amount']/1e6:.1f} & {100*d['large_share']:.1f}\\% & {100*d['seed_share']:.1f}\\% & {100*d['blr']:.1f}\\% & {100*d['ncr']:.1f}\\%\\\\")
t += ["\\bottomrule\\end{tabular}\\end{table*}"]; tabs.append(t)
for n, t in zip(['clf','grid','abl','slice','clu'], tabs): open(os.path.join(HERE, f'tab_{n}.tex'),'w').write("\n".join(t))
print("ok")

# ---- CSV tables built from results.json (so they always match the paper)
T = os.path.join(RES, 'tables_csv'); os.makedirs(T, exist_ok=True)
rows = []
for n, r in R['clf'].items():
    rows.append({'model': n, 'accuracy': r['acc'], 'balanced_accuracy': r['bacc'], 'mcc': r['mcc'], 'precision': r['prec'],
                 'recall': r['rec'], 'f1': r['f1'], 'f1_ci_low': r['f1_ci'][0], 'f1_ci_high': r['f1_ci'][1],
                 'roc_auc': r['auc'], 'auc_ci_low': r['auc_ci'][0], 'auc_ci_high': r['auc_ci'][1],
                 'cv_f1': r['cv_f1'], 'selected_params': r['best']})
pd.DataFrame(rows).round(4).to_csv(os.path.join(T, 'classification_results.csv'), index=False)
pd.DataFrame(R['ablation']).T.round(4).rename_axis('feature_set').to_csv(os.path.join(T, 'ablation.csv'))
pd.DataFrame({'k': [int(k) for k in R['sil']], 'silhouette': list(R['sil'].values()),
              'inertia': [R['inertia'][k] for k in R['sil']]}).round(4).to_csv(os.path.join(T, 'kmeans_silhouette.csv'), index=False)
pd.DataFrame([{'cluster': int(c) + 1, 'sectors': '; '.join(d['sectors']), 'rounds': d['n_deals'], 'median_usd': d['med_amount'],
               'large_share': d['large_share'], 'seed_share': d['seed_share'], 'bengaluru_share': d['blr'],
               'delhi_ncr_share': d['ncr']} for c, d in R['clusters'].items()]).round(4).to_csv(os.path.join(T, 'cluster_summary.csv'), index=False)
print('tables + csv written')
