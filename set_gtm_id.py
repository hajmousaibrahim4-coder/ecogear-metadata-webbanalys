from pathlib import Path
import re, sys
if len(sys.argv)!=2 or not re.fullmatch(r"GTM-[A-Z0-9]+", sys.argv[1]):
    raise SystemExit("Använd: python set_gtm_id.py GTM-XXXXXXX")
root=Path(__file__).parent
for f in root.rglob("*.html"):
    text=f.read_text(encoding="utf-8")
    text=text.replace("GTM-XXXXXXX", sys.argv[1])
    f.write_text(text, encoding="utf-8")
print("GTM-ID uppdaterat i alla HTML-filer.")
