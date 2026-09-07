from pathlib import Path
from bs4 import BeautifulSoup
import csv, json
root=Path(__file__).parent
rows=[]
for path in sorted(root.rglob("*.html")):
    soup=BeautifulSoup(path.read_text(encoding="utf-8"),"html.parser")
    title=soup.title.string.strip() if soup.title and soup.title.string else ""
    desc=soup.find("meta",attrs={"name":"description"})
    can=soup.find("link",attrs={"rel":"canonical"})
    h1=soup.find("h1")
    micro=len(soup.find_all(attrs={"itemscope":True}))
    ld=len(soup.find_all("script",attrs={"type":"application/ld+json"}))
    rows.append([str(path.relative_to(root)),title,desc.get("content","") if desc else "",can.get("href","") if can else "",h1.get_text(" ",strip=True) if h1 else "",micro,ld])
with (root/"metadata_audit_result.csv").open("w",newline="",encoding="utf-8-sig") as f:
    w=csv.writer(f); w.writerow(["fil","title","description","canonical","h1","microdata_objekt","jsonld_block"]); w.writerows(rows)
print("Klart: metadata_audit_result.csv skapad med",len(rows),"sidor")
