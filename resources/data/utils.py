import pandas
import numpy

cols = ["returnOnAssets", "returnOnEquity", "freeCashFlowToAssets", "freeCashFlowToEquity", "operatingProfitMargin", "netProfitMargin", "payoutRatio"]

def fill(f, n, p):
    f_strip = f[f["symbol"] == n]
    f_strip = f_strip.reset_index(drop=True)
    f_result = pandas.DataFrame(columns=f.columns)
    f_result["reportingDate"] = p["atDate"]
    f_result["symbol"] = n
    for i in range(0, f_result.shape[0]):
        idx = numpy.searchsorted(f_strip["reportingDate"].values, f_result["reportingDate"].values[i])
        if idx <= 0:
            continue
        else:
            f_result.loc[i, cols] = f_strip.loc[idx - 1, cols]
    return f_result
