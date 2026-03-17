export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-800 bg-[#0f172a] py-8 text-center text-sm text-gray-500">
            <div className="container mx-auto px-4">
                <p className="mb-4">
                    &copy; {new Date().getFullYear()} Merrick Investments PLC. All rights reserved.
                </p>
                <div className="mx-auto max-w-2xl rounded-lg bg-red-900/10 border border-red-900/20 p-4">
                    <h4 className="mb-2 font-bold text-red-400">Risk Warning</h4>
                    <p className="text-xs">
                        Investment in cryptocurrency involves high risk and returns are not 100% guaranteed. 
                        Past performance is not indicative of future results. 
                        Users have a better chance earning and tracking their money when they keep in contact with staff.
                        Please invest responsibly.
                    </p>
                </div>
            </div>
        </footer>
    );
}
