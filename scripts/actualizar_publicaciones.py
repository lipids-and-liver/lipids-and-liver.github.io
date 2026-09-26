#!/usr/bin/env python3
"""
Script de extracción y actualización automática de publicaciones del Grupo Lipids & Liver.
Fuente: Portal oficial de la Universidad del País Vasco (UPV/EHU)
https://www.ehu.eus/es/web/lipidsliver/argitalpenak (8 páginas, 155 publicaciones)

Enriquece automáticamente con:
- DOIs oficiales mediante Europe PMC y CrossRef REST APIs
- Abstracts científicos completos
- Clasificación temática por líneas de investigación del grupo
"""

import json
import os
import re
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor
from bs4 import BeautifulSoup

BASE_URL = (
    "https://www.ehu.eus/es/web/lipidsliver/argitalpenak?"
    "p_p_id=com_liferay_asset_publisher_web_portlet_AssetPublisherPortlet_INSTANCE_p8wQ"
    "&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view"
    "&_com_liferay_asset_publisher_web_portlet_AssetPublisherPortlet_INSTANCE_p8wQ_delta=20"
    "&p_r_p_resetCur=false"
    "&_com_liferay_asset_publisher_web_portlet_AssetPublisherPortlet_INSTANCE_p8wQ_cur={page}"
)

def scrape_listing():
    print("1. Extrayendo listado de publicaciones de las 8 páginas de la UPV/EHU...")
    pubs = []
    for page in range(1, 9):
        url = BASE_URL.format(page=page)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        items = soup.select('li.asset-summary')
        
        for item in items:
            art = item.select_one('.journal-content-article')
            if not art:
                continue
            
            author_el = art.select_one('.author')
            title_el = art.select_one('.template-title')
            media_el = art.select_one('.publication-media')
            year_el = art.select_one('.publication-year')
            a_el = item.find('a')
            
            author = author_el.get_text(' ', strip=True) if author_el else ''
            title = title_el.get_text(' ', strip=True) if title_el else ''
            journal = media_el.get_text(' ', strip=True) if media_el else ''
            year = year_el.get_text(' ', strip=True) if year_el else ''
            href = a_el.get('href') if a_el else ''
            
            pubs.append({
                'page': page,
                'title': title.strip(),
                'authors': author.strip(),
                'journal': journal.strip().rstrip('.,').strip(),
                'year': year.strip(),
                'ehu_url': href
            })
    print(f"   -> {len(pubs)} publicaciones encontradas.")
    return pubs

def fetch_detail(p):
    url = p['ehu_url']
    data = dict(p)
    if not url:
        return data
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        art = soup.select_one('.journal-content-article')
        if art:
            dts = [dt.get_text(strip=True).rstrip(':') for dt in art.select('dt')]
            dds = [dd.get_text(strip=True) for dd in art.select('dd')]
            for k, v in zip(dts, dds):
                data[k] = v
            h1 = art.select_one('h1')
            if h1:
                data['detail_title'] = h1.get_text(' ', strip=True)
    except Exception:
        pass
    return data

def enrich_with_apis(p):
    title = (p.get('detail_title') or p.get('title') or '').strip()
    res = dict(p)
    
    # Year
    year_raw = (p.get('Año') or p.get('year') or '').strip()
    m_year = re.search(r'\b(19\d\d|20\d\d)\b', year_raw)
    if m_year:
        res['year'] = m_year.group(1)
    elif '2019' in p.get('ehu_url', ''):
        res['year'] = '2019'
    elif '2021' in p.get('ehu_url', ''):
        res['year'] = '2021'
    elif '2022' in p.get('ehu_url', ''):
        res['year'] = '2022'
    else:
        res['year'] = '2020'
        
    # Journal
    journal = (p.get('Revista') or p.get('Medio de publicación') or p.get('Libro') or p.get('journal') or '').strip()
    if not journal:
        if 'patholology' in p.get('ehu_url', ''):
            journal = 'J Pathol'
        elif 'anal-chem' in p.get('ehu_url', ''):
            journal = 'Anal Chem'
    res['journal'] = journal.rstrip('.,').strip()
    
    if res.get('DOI'):
        res['doi'] = res['DOI'].strip()
        
    # Europe PMC query
    try:
        clean_t = title.replace('"', '').strip()
        q = urllib.parse.quote(f'TITLE:"{clean_t}"')
        url = f'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query={q}&format=json&resultType=core&pageSize=1'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        data = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        results = data.get('resultList', {}).get('result', [])
        
        if not results:
            words = re.sub(r'[^\w\s]', ' ', title).split()[:8]
            words_q = urllib.parse.quote(' '.join(words))
            url = f'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query={words_q}&format=json&resultType=core&pageSize=1'
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            data = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
            results = data.get('resultList', {}).get('result', [])
            
        if results:
            r = results[0]
            if not res.get('doi') and r.get('doi'):
                res['doi'] = r.get('doi')
            if r.get('abstractText'):
                clean_abs = re.sub(r'<[^>]+>', '', r.get('abstractText'))
                res['abstract'] = clean_abs.strip()
            if not res.get('journal') and r.get('journalTitle'):
                res['journal'] = r.get('journalTitle')
            if not res.get('year') and r.get('pubYear'):
                res['year'] = r.get('pubYear')
    except Exception:
        pass
        
    # CrossRef fallback
    if not res.get('doi'):
        try:
            q_cr = urllib.parse.quote(title)
            url_cr = f'https://api.crossref.org/works?query.bibliographic={q_cr}&rows=1'
            req_cr = urllib.request.Request(url_cr, headers={'User-Agent': 'mailto:lipidsliver@ehu.eus'})
            data_cr = json.loads(urllib.request.urlopen(req_cr, timeout=10).read().decode('utf-8'))
            items_cr = data_cr.get('message', {}).get('items', [])
            if items_cr and items_cr[0].get('score', 0) > 40:
                res['doi'] = items_cr[0].get('DOI')
        except Exception:
            pass

    return res

def classify_topic(p):
    title = p.get('detail_title') or p.get('title') or ''
    t_lower = title.lower()
    abs_lower = (p.get('abstract') or '').lower()
    
    if any(k in t_lower for k in [
        'imaging mass spectrometry', 'maldi imaging', 'maldi-ims', 
        'molecular histology by imaging', 'spatial omics', 'spatial lipidomics', 
        'distribution of lipids in human brain', 'profiling and imaging of lipids on brain', 
        'matrix-assisted laser desorption ionization imaging mass spectrometry'
    ]) or any(k in abs_lower for k in ['maldi-ms imaging', 'imaging mass spectrometry (ims)', 'imaging mass spectrometry of lipids']):
        return 'spatial-omics'
        
    if any(k in t_lower for k in [
        'ecotoxicoproteomics', 'ecotoxico', 'marine mussel', 'nanoparticle', 
        'anthropogenic', 'mytilus edulis', 'aquaculture', 'contaminant', 
        'pollutant', 'endocrine disrupt', 'disrupting chemical', 'environmental proteomic'
    ]) or any(k in abs_lower for k in ['ecotoxicoproteomics', 'endocrine-disrupting', 'environmental contaminant', 'anthropogenic pressure', 'mytilus edulis']):
        return 'exposome'
        
    if any(k in t_lower for k in [
        'e2f', 'liver regeneration', 'acetaminophen', 'paracetamol', 
        'hepatotoxicity', 'acute kidney injury', 'partial hepatectomy', 
        'cell cycle', 'cdkn1a', 'p107'
    ]) or any(k in abs_lower for k in ['transcription factor e2f', 'e2f1', 'e2f2', 'liver regeneration after partial hepatectomy']):
        return 'e2f'
        
    if any(k in t_lower for k in [
        'cholangiocarcinoma', 'hepatocellular carcinoma', 'hepatoma', 
        'liver cancer', 'carcinoma', 'colorectal neoplasia', 'melanoma', 
        'oncogene', 'snd1', 'tumor', 'tumour', 'metastasis', 'cancer', 
        'malignant', 'leukemia', 'lymphoma', 'neoplasia', 'sorafenib'
    ]) or any(k in abs_lower for k in ['cholangiocarcinoma', 'hepatocellular carcinoma', 'snd1 oncogene', 'liver cancer']):
        return 'cancer'
        
    if any(k in t_lower for k in [
        'lipidomic', 'lipidome', 'metabolomic', 'metabonomics', 'sgiker', 
        'phospholipid signature', 'lipid signature', 'lipid profiling', 
        'ultra-high performance liquid chromatography', 'uhplc-ms', 'magnetic resonance spectroscopy'
    ]) or any(k in abs_lower for k in ['sgiker lipidomics', 'untargeted lipidomics', 'shotgun lipidomics', 'uhplc-ms lipidomic']):
        return 'lipidomics'
        
    return 'mafld'

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    workspace_dir = os.path.dirname(script_dir)
    target_dir = os.path.join(workspace_dir, 'src', 'content', 'publications', 'es')
    os.makedirs(target_dir, exist_ok=True)
    
    # 1. Scrape listing
    pubs = scrape_listing()
    
    # 2. Fetch detail pages
    print("2. Obteniendo metadatos detallados de cada ficha de publicación...")
    with ThreadPoolExecutor(max_workers=8) as ex:
        detailed = list(ex.map(fetch_detail, pubs))
        
    # 3. Enrich with DOIs & Abstracts
    print("3. Enriqueciendo con DOIs oficiales y abstracts vía Europe PMC / CrossRef...")
    with ThreadPoolExecutor(max_workers=6) as ex:
        enriched = list(ex.map(enrich_with_apis, detailed))
        
    # 4. Sort and write markdown files
    def get_sort_key(p):
        try:
            return -int(p.get('year', 0))
        except Exception:
            return 0
            
    pubs_sorted = sorted(enriched, key=get_sort_key)
    
    # Clean previous
    for f in os.listdir(target_dir):
        if f.endswith('.md'):
            os.remove(os.path.join(target_dir, f))
            
    def yaml_str(s):
        clean = re.sub(r'\s+', ' ', str(s or '')).strip()
        escaped = clean.replace('\\', '\\\\').replace('"', '\\"')
        return f'"{escaped}"'
        
    print(f"4. Escribiendo {len(pubs_sorted)} archivos Markdown en {target_dir}...")
    for idx, p in enumerate(pubs_sorted, 1):
        pub_id = f"pub-{idx:03d}"
        filepath = os.path.join(target_dir, f"{pub_id}.md")
        
        title = p.get('detail_title') or p.get('title') or ''
        authors = p.get('Autoría') or p.get('authors') or ''
        journal = (p.get('Revista') or p.get('Medio de publicación') or p.get('Libro') or p.get('journal') or '').rstrip('.,').strip()
        year = str(p.get('year') or '2020')
        topic = classify_topic(p)
        doi = p.get('doi') or ''
        abstract = p.get('abstract') or ''
        
        content = f"""---
id: {yaml_str(pub_id)}
year: {yaml_str(year)}
title: {yaml_str(title)}
authors: {yaml_str(authors)}
journal: {yaml_str(journal)}
topic: {yaml_str(topic)}"""
        if doi:
            content += f"\ndoi: {yaml_str(doi)}"
        content += "\n---\n\n"
        if abstract:
            content += abstract.strip() + "\n"
            
        with open(filepath, 'w', encoding='utf-8') as f_out:
            f_out.write(content)
            
    print(f"Proceso completado exitosamente: {len(pubs_sorted)} publicaciones actualizadas.")

if __name__ == '__main__':
    main()
