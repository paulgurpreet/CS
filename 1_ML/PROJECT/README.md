# What Predicts Large Funding Rounds for Indian Start-ups?

A classification and sector-clustering case study using classical machine learning.
B.Sc. (H) Computer Science, Semester VI, University of Delhi: Machine Learning application project.
Domain: Economy / Innovation. SDG 8 (Decent Work and Economic Growth) and SDG 9 (Industry, Innovation and Infrastructure).

## What this project does
- Cleans the public Kaggle file *Indian Startup Funding* (3,044 rows, 2015 to Jan 2020): fixes dates, converts amounts to numbers, and merges spelling variants of city, investment type and sector. 2,073 rounds with a disclosed amount are used.
- **Classification:** labels each round as large or small (above or below USD 1.2 M, the 2015-2017 median) using city, sector, investment type and year. Models: logistic regression, decision tree, Bernoulli Naive Bayes and k-NN, compared with simple baselines.
- **Validation:** time-based split (train 2015-2017, test 2018-Jan 2020) and 5-fold forward-chaining cross-validation.
- **Clustering:** k-means on 13 sector funding profiles, with k chosen by silhouette score.
- Metrics: accuracy, F1, ROC-AUC, silhouette (plus precision, recall, balanced accuracy and MCC).

## Main findings
| Question | Result |
|---|---|
| Can the features classify large rounds? | Test ROC-AUC about 0.80-0.82 for all four models; confidence intervals overlap. |
| What carries the signal? | Investment type alone gives AUC 0.807 (all features: 0.817). City, sector and year add little. |
| Is F1 enough? | No. 72.9% of test rounds are large (49.8% in training), so "always large" scores F1 0.844. AUC is a better guide. |
| Do sectors cluster? | Best k = 2, silhouette 0.244 (weak structure). |
| Concentration | Bengaluru, Delhi-NCR and Mumbai hold 84.6% of disclosed funding; the top 1% of rounds hold 44.2%. |

## Files
| File | Description |
|---|---|
| `run_experiments.py` | Full pipeline: cleaning, models, clustering, figures, CSV tables |
| `startup_funding.csv` | Raw data (Kaggle, CC0) |
| `results.json` | Every number used in the paper |
| `classification_results.csv`, `ablation.csv`, `kmeans_silhouette.csv`, `cluster_summary.csv`, `sector_profiles.csv` | Result tables |
| `cleaned_data.csv` | Cleaned rounds with the large/small label |
| `fig*.pdf` | Figures used in the paper |
| `Indian_Startup_Funding_Case_Study*.pdf` | The paper |

## How to run
```bash
pip install -r requirements.txt
python run_experiments.py startup_funding.csv .
```
This recreates `results.json`, the figures and the CSV tables (random seed 42).

## Reproducibility note
The k-NN result can differ slightly between library versions (the tuned k was 31 in one environment and 15 in another). All other results were identical. The paper reports the author's own run.

## Data and licence
Data: [Indian Startup Funding](https://www.kaggle.com/datasets/sudalairajkumar/indian-startup-funding), Kaggle, CC0.

## Use of AI tools
The code and report draft are written with help of AI assistant(Claude) and I ran the code myself and reviewed the results before submitting.
