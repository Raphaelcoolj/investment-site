import re

val = "c:/crypto-site/src/app/dashboard/investments/page.tsx"
with open(val, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace yield values
text = re.sub(r"yield: '\d+%',", "yield: '20%',", text)

# Replace Annual Yield label
text = text.replace("Annual Yield", "Monthly Return")

# Replace Old Math with New Math for real estate
old_math = """                                                <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10">
                                                    <p className="text-[9px] font-black text-emerald-500/60 uppercase mb-1">Monthly ROI</p>
                                                    <p className="text-lg font-black text-emerald-400">
                                                        ${((parseFloat(investAmount) * (parseFloat(selectedProduct.yield) / 100)) / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                                <div className="bg-blue-500/5 rounded-2xl p-4 border border-blue-500/10">
                                                    <p className="text-[9px] font-black text-blue-500/60 uppercase mb-1">Annual ROI</p>
                                                    <p className="text-lg font-black text-blue-400">
                                                        ${(parseFloat(investAmount) * (parseFloat(selectedProduct.yield) / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>"""

new_math = """                                                <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10">
                                                    <p className="text-[9px] font-black text-emerald-500/60 uppercase mb-1">Monthly ROI</p>
                                                    <p className="text-lg font-black text-emerald-400">
                                                        ${(parseFloat(investAmount) * (parseFloat(selectedProduct.yield) / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                                <div className="bg-blue-500/5 rounded-2xl p-4 border border-blue-500/10">
                                                    <p className="text-[9px] font-black text-blue-500/60 uppercase mb-1">Annual ROI</p>
                                                    <p className="text-lg font-black text-blue-400">
                                                        ${(parseFloat(investAmount) * (parseFloat(selectedProduct.yield) / 100) * 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>"""
text = text.replace(old_math, new_math)

# Replace calculated based on
text = text.replace("Calculated based on current {selectedProduct.yield} fixed yield", "Calculated based on current {selectedProduct.yield} fixed monthly return")

# Replace alternative logic (10% to 20%)
old_stock_math = """                                        <div className="bg-slate-900/40 rounded-2xl p-4 border border-white/5">
                                            <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Potential Monthly ROI (10%)</p>
                                            <p className="text-lg font-black text-white">
                                                ${(parseFloat(investAmount) * 0.1).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </p>
                                        </div>"""

new_stock_math = """                                        <div className="bg-slate-900/40 rounded-2xl p-4 border border-white/5">
                                            <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Potential Monthly ROI (20%)</p>
                                            <p className="text-lg font-black text-white">
                                                ${(parseFloat(investAmount) * 0.2).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </p>
                                        </div>"""

text = text.replace(old_stock_math, new_stock_math)

with open(val, 'w', encoding='utf-8') as f:
    f.write(text)

print("Done python script")
