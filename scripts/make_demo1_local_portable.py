import os
import re

DEMO1_DIR = os.path.abspath('demos/demo1')

def get_relative_prefix(depth):
    if depth == 0:
        return "./"
    return "../" * depth

def convert_url(url, rel_prefix):
    if not url or url.startswith(('http://', 'https://', 'mailto:', 'tel:', '#', 'javascript:')):
        return url
    
    # Internal links
    if url == "/":
        return rel_prefix + "index.html"
    if url.startswith("/#"):
        return rel_prefix + "index.html" + url[1:]
    
    # Language home roots
    if url in ("/eu", "/eu/"):
        return rel_prefix + "eu/index.html"
    if url.startswith("/eu/#"):
        return rel_prefix + "eu/index.html" + url[4:]
    if url in ("/en", "/en/"):
        return rel_prefix + "en/index.html"
    if url.startswith("/en/#"):
        return rel_prefix + "en/index.html" + url[4:]
    
    # Asset paths
    if url.startswith("/assets/"):
        return rel_prefix + url[1:]
    if url.startswith("/_astro/"):
        return rel_prefix + url[1:]
    if url.startswith("/logo/"):
        return rel_prefix + url[1:]
        
    # Internal page paths
    if url.startswith("/"):
        clean = url[1:]
        parts = clean.split('#', 1)
        path_part = parts[0]
        anchor = ('#' + parts[1]) if len(parts) > 1 else ''
        
        if path_part.endswith('/'):
            path_part += "index.html"
        elif not path_part.endswith('.html'):
            path_part += "/index.html"
            
        return rel_prefix + path_part + anchor
        
    return url

def process_html_file(file_path):
    rel_path = os.path.relpath(file_path, DEMO1_DIR)
    depth = rel_path.count(os.sep)
    rel_prefix = get_relative_prefix(depth)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace href="..." and src="..."
    def replace_attr(match):
        attr = match.group(1) # href or src
        quote = match.group(2) # " or '
        val = match.group(3)
        new_val = convert_url(val, rel_prefix)
        return f'{attr}={quote}{new_val}{quote}'

    # Match href="..." or src="..."
    content = re.sub(r'\b(href|src)=(["\'])(/[^"\']*)\2', replace_attr, content)
    
    # Also meta content="/..." for images/tags
    content = re.sub(r'\b(content)=(["\'])(/[^"\']*)\2', replace_attr, content)

    # 2. Fix JS navigation for dropdowns
    # Curriculum: window.location.href = prefix + '/curriculum/' + e.target.value;
    curr_repl = f"""
        if (window.location.protocol === 'file:') {{
          window.location.href = '{rel_prefix}' + (prefix ? prefix.substring(1) + '/' : '') + 'curriculum/' + e.target.value + '/index.html';
        }} else {{
          window.location.href = prefix + '/curriculum/' + e.target.value;
        }}
    """
    content = re.sub(r'window\.location\.href\s*=\s*prefix\s*\+\s*[\'"]/curriculum/[\'"]\s*\+\s*e\.target\.value;', curr_repl.strip(), content)

    # Tesis: window.location.href = prefix + '/tesis/' + e.target.value;
    tesis_repl = f"""
        if (window.location.protocol === 'file:') {{
          window.location.href = '{rel_prefix}' + (prefix ? prefix.substring(1) + '/' : '') + 'tesis/' + e.target.value + '/index.html';
        }} else {{
          window.location.href = prefix + '/tesis/' + e.target.value;
        }}
    """
    content = re.sub(r'window\.location\.href\s*=\s*prefix\s*\+\s*[\'"]/tesis/[\'"]\s*\+\s*e\.target\.value;', tesis_repl.strip(), content)

    # Lineas: window.location.href = prefix + '/lineas/' + e.target.value;
    lineas_repl = f"""
        if (window.location.protocol === 'file:') {{
          window.location.href = '{rel_prefix}' + (prefix ? prefix.substring(1) + '/' : '') + 'lineas/' + e.target.value + '/index.html';
        }} else {{
          window.location.href = prefix + '/lineas/' + e.target.value;
        }}
    """
    content = re.sub(r'window\.location\.href\s*=\s*prefix\s*\+\s*[\'"]/lineas/[\'"]\s*\+\s*e\.target\.value;', lineas_repl.strip(), content)

    # 3. Fix Theme logo switch in JS
    content = content.replace("'/assets/images/logo/ehu_logo_negatiboa.svg'", f"'{rel_prefix}assets/images/logo/ehu_logo_negatiboa.svg'")
    content = content.replace("'/assets/images/logo/ehu_logo_positiboa.svg'", f"'{rel_prefix}assets/images/logo/ehu_logo_positiboa.svg'")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

count = 0
for root, dirs, files in os.walk(DEMO1_DIR):
    for f in files:
        if f.endswith('.html'):
            process_html_file(os.path.join(root, f))
            count += 1

print(f"Processed {count} HTML files in {DEMO1_DIR} successfully for local file:// access!")
