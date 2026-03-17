const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'crypto-site', 'src', 'app', 'dashboard', 'investments', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all yields in REAL_ESTATE_PROPERTIES
content = content.replace(/yield: '\d+%',/g, "yield: '20%',");

// Replace the word Annual Yield with Monthly Return
content = content.replace(/Annual Yield/g, "Monthly Return");

// Remove the Math (Annual vs Monthly ROI) and compute properly based on 20%
// The user has this:
/*
                                                <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10">
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
                                                </div>
*/
// New code for this part:
const oldMath = `                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10">
                                                    <p className="text-[9px] font-black text-emerald-500/60 uppercase mb-1">Monthly ROI</p>
                                                    <p className="text-lg font-black text-emerald-400">
                                                        \${((parseFloat(investAmount) * (parseFloat(selectedProduct.yield) / 100)) / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                                <div className="bg-blue-500/5 rounded-2xl p-4 border border-blue-500/10">
                                                    <p className="text-[9px] font-black text-blue-500/60 uppercase mb-1">Annual ROI</p>
                                                    <p className="text-lg font-black text-blue-400">
                                                        \${(parseFloat(investAmount) * (parseFloat(selectedProduct.yield) / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-gray-600 text-center italic">Calculated based on current {selectedProduct.yield} fixed yield</p>`;

const newMath = `                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10">
                                                    <p className="text-[9px] font-black text-emerald-500/60 uppercase mb-1">Monthly ROI</p>
                                                    <p className="text-lg font-black text-emerald-400">
                                                        \${(parseFloat(investAmount) * (parseFloat(selectedProduct.yield) / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                                <div className="bg-blue-500/5 rounded-2xl p-4 border border-blue-500/10">
                                                    <p className="text-[9px] font-black text-blue-500/60 uppercase mb-1">Annual ROI</p>
                                                    <p className="text-lg font-black text-blue-400">
                                                        \${(parseFloat(investAmount) * (parseFloat(selectedProduct.yield) / 100) * 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-gray-600 text-center italic">Calculated based on current {selectedProduct.yield} fixed monthly return</p>`;

content = content.replace(oldMath, newMath);

// Also handle the Stocks & Commodities 'Potential Monthly ROI (10%)' to 20%
const oldStockMath = `                                        <div className="bg-slate-900/40 rounded-2xl p-4 border border-white/5">
                                            <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Potential Monthly ROI (10%)</p>
                                            <p className="text-lg font-black text-white">
                                                \${(parseFloat(investAmount) * 0.1).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </p>
                                        </div>`;

const newStockMath = `                                        <div className="bg-slate-900/40 rounded-2xl p-4 border border-white/5">
                                            <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Potential Monthly ROI (20%)</p>
                                            <p className="text-lg font-black text-white">
                                                \${(parseFloat(investAmount) * 0.2).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </p>
                                        </div>`;

content = content.replace(oldStockMath, newStockMath);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Update successful!');
