import os
import re
import io
import json
import base64
import glob
from bs4 import BeautifulSoup
from PIL import Image

WORKSPACE = '/home/smzlogoj/Workspaces/lipid_and_liver'
DIST_DIR = os.path.join(WORKSPACE, 'dist')
PUBLIC_DIR = os.path.join(WORKSPACE, 'public')
OUTPUT_DIR = os.path.join(WORKSPACE, 'version_inline')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Image cache
_image_cache = {}

def get_base64_image(rel_path, max_dim=800, quality=80):
    clean_path = rel_path.lstrip('/')
    abs_path = os.path.join(PUBLIC_DIR, clean_path)
    
    if not os.path.exists(abs_path):
        abs_path = os.path.join(DIST_DIR, clean_path)
    
    if not os.path.exists(abs_path):
        print(f"Warning: Image not found: {rel_path}")
        return rel_path
        
    cache_key = (abs_path, max_dim, quality)
    if cache_key in _image_cache:
        return _image_cache[cache_key]
        
    ext = os.path.splitext(abs_path)[1].lower()
    
    if ext == '.svg':
        with open(abs_path, 'rb') as f:
            data = f.read()
        b64 = base64.b64encode(data).decode('utf-8')
        res = f"data:image/svg+xml;base64,{b64}"
        _image_cache[cache_key] = res
        return res
        
    try:
        img = Image.open(abs_path)
        if ext == '.png':
            buf = io.BytesIO()
            if max(img.size) > max_dim:
                scale = max_dim / max(img.size)
                img = img.resize((int(img.width * scale), int(img.height * scale)), Image.Resampling.LANCZOS)
            img.save(buf, format='PNG', optimize=True)
            b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
            res = f"data:image/png;base64,{b64}"
            _image_cache[cache_key] = res
            return res
        else:
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            if max(img.size) > max_dim:
                scale = max_dim / max(img.size)
                img = img.resize((int(img.width * scale), int(img.height * scale)), Image.Resampling.LANCZOS)
            buf = io.BytesIO()
            img.save(buf, format='JPEG', quality=quality, optimize=True)
            b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
            res = f"data:image/jpeg;base64,{b64}"
            _image_cache[cache_key] = res
            return res
    except Exception as e:
        print(f"Error encoding image {abs_path}: {e}")
        return rel_path

def inline_images_in_html(html_str):
    def replacer(match):
        orig_src = match.group(1)
        if orig_src.startswith('data:') or orig_src.startswith('http'):
            return f'src="{orig_src}"'
        max_d = 320 if 'team' in orig_src else (1100 if 'hero' in orig_src else 800)
        q = 80
        b64 = get_base64_image(orig_src, max_dim=max_d, quality=q)
        return f'src="{b64}"'
    return re.sub(r'src=[\"\']([^\"\']+)[\"\']', replacer, html_str)

def build_full_inline_web():
    print("Building full inline single-file HTML...")
    
    with open(os.path.join(DIST_DIR, 'index.html'), 'r', encoding='utf-8') as f:
        html = f.read()

    # Read and inline styles.css
    with open(os.path.join(PUBLIC_DIR, 'assets/css/styles.css'), 'r', encoding='utf-8') as f:
        css = f.read()

    # In styles.css, replace ../images/hero.jpg with base64
    hero_b64 = get_base64_image('/assets/images/hero.jpg', max_dim=1000, quality=78)
    css = css.replace("../images/hero.jpg", hero_b64)
    css = css.replace("url('../images/hero.jpg')", f"url('{hero_b64}')")

    # FontAwesome woff2 inlining
    fa_font_path = os.path.join(PUBLIC_DIR, 'assets/fa-solid-900.woff2')
    fa_css_block = ""
    if os.path.exists(fa_font_path):
        with open(fa_font_path, 'rb') as f:
            fa_b64 = base64.b64encode(f.read()).decode('utf-8')
        fa_css_block = f"""
@font-face {{
  font-family: 'Font Awesome 6 Free';
  font-style: normal;
  font-weight: 900;
  font-display: block;
  src: url("data:font/woff2;base64,{fa_b64}") format("woff2");
}}
.fa, .fas, .fa-solid {{
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
}}
"""

    # Modal CSS
    modal_css = """
/* Single-File Inline Modal Styles */
.inline-modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(7, 9, 14, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.25s ease;
}
.inline-modal-overlay.active {
  display: flex;
  opacity: 1;
}
.inline-modal-container {
  background: var(--bg-surface);
  color: var(--text-primary);
  width: 100%;
  max-width: 960px;
  max-height: 90vh;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: scale(0.96);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.inline-modal-overlay.active .inline-modal-container {
  transform: scale(1);
}
.inline-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: var(--bg-surface-alt);
  border-bottom: 1px solid var(--border-color);
}
.inline-modal-header-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ehu-navy);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}
.inline-modal-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}
.inline-modal-close:hover {
  background: rgba(0,0,0,0.06);
  color: var(--ehu-navy);
}
.inline-modal-body {
  padding: 1.5rem 2rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.inline-modal-body .cv-container {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
"""

    # Collect detail content
    detail_data = {
        'curriculum': {},
        'lineas': {},
        'tesis': {}
    }

    # Extract CVs
    for cv_path in glob.glob(os.path.join(DIST_DIR, 'curriculum/*/index.html')):
        member_id = os.path.basename(os.path.dirname(cv_path))
        with open(cv_path, 'r', encoding='utf-8') as f:
            cv_soup = BeautifulSoup(f.read(), 'html.parser')
        container = cv_soup.find('div', class_='cv-container')
        if container:
            # remove back button
            back_link = container.find('a', class_='btn-inst-secondary')
            if back_link and back_link.parent:
                back_link.parent.decompose()
            # replace member select navigation inside modal
            html_chunk = str(container)
            html_chunk = inline_images_in_html(html_chunk)
            detail_data['curriculum'][member_id] = html_chunk

    # Extract Research Lines
    for line_path in glob.glob(os.path.join(DIST_DIR, 'lineas/*/index.html')):
        line_id = os.path.basename(os.path.dirname(line_path))
        with open(line_path, 'r', encoding='utf-8') as f:
            line_soup = BeautifulSoup(f.read(), 'html.parser')
        container = line_soup.find('div', class_='cv-container')
        if container:
            back_link = container.find('a', class_='btn-inst-secondary')
            if back_link and back_link.parent:
                back_link.parent.decompose()
            html_chunk = str(container)
            html_chunk = inline_images_in_html(html_chunk)
            detail_data['lineas'][line_id] = html_chunk

    # Extract Theses
    for thesis_path in glob.glob(os.path.join(DIST_DIR, 'tesis/*/index.html')):
        thesis_id = os.path.basename(os.path.dirname(thesis_path))
        with open(thesis_path, 'r', encoding='utf-8') as f:
            t_soup = BeautifulSoup(f.read(), 'html.parser')
        container = t_soup.find('div', class_='cv-container')
        if container:
            back_link = container.find('a', class_='btn-inst-secondary')
            if back_link and back_link.parent:
                back_link.parent.decompose()
            html_chunk = str(container)
            html_chunk = inline_images_in_html(html_chunk)
            detail_data['tesis'][thesis_id] = html_chunk

    print(f"Extracted {len(detail_data['curriculum'])} CVs, {len(detail_data['lineas'])} Research Lines, {len(detail_data['tesis'])} Theses.")

    # Base64 logos for dark/light toggle
    ehu_pos_b64 = get_base64_image('/assets/images/logo/ehu_logo_positiboa.svg')
    ehu_neg_b64 = get_base64_image('/assets/images/logo/ehu_logo_negatiboa.svg')

    # Replace relative stylesheet link with inline <style>
    style_replacement = f"""
  <style>
{fa_css_block}
{css}
{modal_css}
  </style>
"""
    html = re.sub(r'<link\s+rel=[\"\']stylesheet[\"\']\s+href=[\"\']/assets/css/styles\.css[\"\']>', lambda m: style_replacement, html)

    # Inline all images in the homepage HTML
    html = inline_images_in_html(html)

    # Replace navigation hrefs so they anchor properly within single file
    nav_replacements = [
        (r'href="/"', 'href="#hero"'),
        (r'href="/#about"', 'href="#about"'),
        (r'href="/#lines"', 'href="#lines"'),
        (r'href="/#team"', 'href="#team"'),
        (r'href="/tesis"', 'href="#theses"'),
        (r'href="/publicaciones"', 'href="#publications"'),
        (r'href="/#training"', 'href="#training"'),
        (r'href="/#contact"', 'href="#contact"'),
        (r'href="/curriculum"', 'href="#team"'),
        (r'href="/#theses"', 'href="#theses"')
    ]
    for pattern, repl in nav_replacements:
        html = re.sub(pattern, repl, html)

    # Add Modal HTML markup before </body>
    modal_html = f"""
<!-- Inline Modal for Research Lines, CVs, and Theses -->
<div class="inline-modal-overlay" id="inlineModalOverlay" role="dialog" aria-modal="true">
  <div class="inline-modal-container">
    <div class="inline-modal-header">
      <h3 class="inline-modal-header-title" id="inlineModalTitle">
        <i class="fas fa-info-circle"></i> Detalle
      </h3>
      <button type="button" class="inline-modal-close" id="inlineModalClose" title="Cerrar (Esc)">&times;</button>
    </div>
    <div class="inline-modal-body" id="inlineModalBody">
      <!-- Dynamic Content Loaded Here -->
    </div>
  </div>
</div>

<script>
  // Embedded Detail Database for Interactive Single-File Browsing
  window.APP_MODAL_DATA = {json.dumps(detail_data)};
  window.EHU_LOGO_POS = "{ehu_pos_b64}";
  window.EHU_LOGO_NEG = "{ehu_neg_b64}";

  document.addEventListener('DOMContentLoaded', () => {{
    const overlay = document.getElementById('inlineModalOverlay');
    const modalBody = document.getElementById('inlineModalBody');
    const modalTitle = document.getElementById('inlineModalTitle');
    const closeBtn = document.getElementById('inlineModalClose');

    function openModal(category, id) {{
      const items = window.APP_MODAL_DATA[category];
      if (!items || !items[id]) return;

      modalBody.innerHTML = items[id];

      // Set category title icon & text
      let icon = 'fa-info-circle';
      let titlePrefix = 'Detalle';
      if (category === 'curriculum') {{
        icon = 'fa-id-card';
        titlePrefix = 'Currículum Investigador/a';
      }} else if (category === 'lineas') {{
        icon = 'fa-microscope';
        titlePrefix = 'Línea de Investigación';
      }} else if (category === 'tesis') {{
        icon = 'fa-graduation-cap';
        titlePrefix = 'Tesis Doctoral';
      }}
      modalTitle.innerHTML = `<i class="fas ${{icon}}"></i> ${{titlePrefix}}`;

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Attach listener to any select inside modal for instant switching
      const memSelect = modalBody.querySelector('#member-select');
      if (memSelect) {{
        memSelect.addEventListener('change', (e) => {{
          if (e.target.value) openModal('curriculum', e.target.value);
        }});
      }}
      const lineSelect = modalBody.querySelector('#line-select');
      if (lineSelect) {{
        lineSelect.addEventListener('change', (e) => {{
          if (e.target.value) openModal('lineas', e.target.value);
        }});
      }}
      const thesisSelect = modalBody.querySelector('#thesis-select');
      if (thesisSelect) {{
        thesisSelect.addEventListener('change', (e) => {{
          if (e.target.value) openModal('tesis', e.target.value);
        }});
      }}

      // Scroll modal body to top
      modalBody.scrollTop = 0;
    }}

    function closeModal() {{
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      modalBody.innerHTML = '';
    }}

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {{
      if (e.target === overlay) closeModal();
    }});
    document.addEventListener('keydown', (e) => {{
      if (e.key === 'Escape' && overlay.classList.contains('active')) {{
        closeModal();
      }}
    }});

    // Intercept clicks on detail links across document
    document.body.addEventListener('click', (e) => {{
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;

      // Match /curriculum/:id
      const cvMatch = href.match(/^\\/?curriculum\\/([a-z0-9-]+)/i);
      if (cvMatch) {{
        e.preventDefault();
        openModal('curriculum', cvMatch[1]);
        return;
      }}

      // Match /lineas/:id
      const lineMatch = href.match(/^\\/?lineas\\/([a-z0-9-]+)/i);
      if (lineMatch) {{
        e.preventDefault();
        openModal('lineas', lineMatch[1]);
        return;
      }}

      // Match /tesis/:id
      const thesisMatch = href.match(/^\\/?tesis\\/([a-z0-9-]+)/i);
      if (thesisMatch) {{
        e.preventDefault();
        openModal('tesis', thesisMatch[1]);
        return;
      }}

      // Language buttons feedback in inline mode
      if (link.classList.contains('lang-btn')) {{
        const lang = link.dataset.lang;
        if (lang !== 'es') {{
          e.preventDefault();
          alert('Esta versión inline está generada en español para su visualización autocontenida sin conexión.');
        }}
      }}
    }});

    // Update Theme toggle to use inline base64 logos
    const originalUpdateTheme = window.updateThemeUI;
    const themeBtn = document.getElementById('theme-toggle');
    const ehuLogo = document.getElementById('ehu-header-logo');

    function syncLogoWithTheme() {{
      const current = document.documentElement.getAttribute('data-theme');
      if (ehuLogo) {{
        ehuLogo.src = current === 'dark' ? window.EHU_LOGO_NEG : window.EHU_LOGO_POS;
      }}
    }}
    if (themeBtn) {{
      themeBtn.addEventListener('click', () => {{
        setTimeout(syncLogoWithTheme, 10);
      }});
    }}
    syncLogoWithTheme();
  }});
</script>
"""
    html = html.replace('</body>', f'{modal_html}</body>')

    out_file = os.path.join(OUTPUT_DIR, 'web_completa_inline.html')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Written: {out_file} ({os.path.getsize(out_file) / (1024*1024):.2f} MB)")

    # Also create index.html in version_inline
    index_file = os.path.join(OUTPUT_DIR, 'index.html')
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Written: {index_file}")

def build_email_newsletter():
    print("Building inline HTML email template (for email body)...")

    # In email template, we keep inline styles on every element (tables, divs, fonts)
    email_html = """<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lipids &amp; Liver - Grupo de Investigación Consolidado | UPV/EHU &amp; IIS Biocruces Bizkaia</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <!-- Main Wrapper -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Container Card (Max width 640px) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Top Bar -->
          <tr>
            <td style="background-color: #001f35; padding: 10px 24px; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #689f38;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="color: #cbd5e1; font-weight: 600;">UPV/EHU &bull; IIS Biocruces Bizkaia</td>
                  <td align="right" style="color: #94a3b8;">Dpto. de Fisiología</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Header / Hero Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #002B49 0%, #1E3A5F 100%); padding: 36px 30px; text-align: left; color: #ffffff;">
              <!-- Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="background-color: rgba(104, 159, 56, 0.25); border: 1px solid rgba(138, 198, 63, 0.5); padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; color: #a3e635; letter-spacing: 0.5px; text-transform: uppercase;">
                    &#9733; Grupo Consolidado del Gobierno Vasco (IT1560-22)
                  </td>
                </tr>
              </table>
              <h1 style="margin: 0 0 12px 0; font-size: 26px; line-height: 1.25; font-weight: 800; color: #ffffff;">
                Grupo de Investigación<br /><span style="color: #8ac63f;">Lipids &amp; Liver</span>
              </h1>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #e2e8f0;">
                Departamento de Fisiología | Facultad de Medicina y Enfermería<br />
                Universidad del País Vasco (UPV/EHU) &bull; Instituto de Investigación Sanitaria Biocruces Bizkaia
              </p>
            </td>
          </tr>

          <!-- Key Metrics Grid -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 24px; border-bottom: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="25%" align="center" style="padding: 8px 4px;">
                    <div style="font-size: 22px; font-weight: 800; color: #002b49;">2007</div>
                    <div style="font-size: 11px; font-weight: 600; color: #689f38; text-transform: uppercase;">Reconocido</div>
                    <div style="font-size: 10px; color: #64748b;">Gobierno Vasco</div>
                  </td>
                  <td width="25%" align="center" style="padding: 8px 4px; border-left: 1px solid #e2e8f0;">
                    <div style="font-size: 22px; font-weight: 800; color: #002b49;">10+</div>
                    <div style="font-size: 11px; font-weight: 600; color: #689f38; text-transform: uppercase;">PDI &amp; Seniors</div>
                    <div style="font-size: 10px; color: #64748b;">Medicina y Enferm.</div>
                  </td>
                  <td width="25%" align="center" style="padding: 8px 4px; border-left: 1px solid #e2e8f0;">
                    <div style="font-size: 22px; font-weight: 800; color: #002b49;">15+</div>
                    <div style="font-size: 11px; font-weight: 600; color: #689f38; text-transform: uppercase;">Tesis Doctorales</div>
                    <div style="font-size: 10px; color: #64748b;">Defendidas y en curso</div>
                  </td>
                  <td width="25%" align="center" style="padding: 8px 4px; border-left: 1px solid #e2e8f0;">
                    <div style="font-size: 20px; font-weight: 800; color: #002b49;">SGIker</div>
                    <div style="font-size: 11px; font-weight: 600; color: #689f38; text-transform: uppercase;">Lipidómica</div>
                    <div style="font-size: 10px; color: #64748b;">Servicios UPV/EHU</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section: Presentation -->
          <tr>
            <td style="padding: 28px 30px; border-bottom: 1px solid #e2e8f0;">
              <h2 style="margin: 0 0 14px 0; font-size: 18px; font-weight: 700; color: #002b49; border-left: 4px solid #689f38; padding-left: 10px;">
                Presentación Institucional
              </h2>
              <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.65; color: #334155;">
                Desarrollamos nuestra actividad investigadora y docente en el <strong>Departamento de Fisiología de la Facultad de Medicina y Enfermería (UPV/EHU)</strong>, articulando proyectos científicos de vanguardia orientados al estudio de las bases moleculares de la patología metabólica hepática.
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #334155;">
                Acreditados ininterrumpidamente como <strong>Grupo Consolidado de Tipo A</strong> por el Gobierno Vasco desde 2007, formamos parte del <strong>Instituto de Investigación Sanitaria Biocruces Bizkaia</strong> y gestionamos la <strong>Unidad de Lipidómica de los SGIker</strong>, impulsando la traslación de biomarcadores y dianas terapéuticas a la práctica clínica.
              </p>
            </td>
          </tr>

          <!-- Section: Research Lines -->
          <tr>
            <td style="padding: 28px 30px; background-color: #fafbfc; border-bottom: 1px solid #e2e8f0;">
              <h2 style="margin: 0 0 18px 0; font-size: 18px; font-weight: 700; color: #002b49; border-left: 4px solid #689f38; padding-left: 10px;">
                Líneas de Investigación Activas
              </h2>
              
              <!-- Research Item 1 -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px;">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #e0f2fe; color: #0369a1; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-bottom: 4px;">MAFLD / MASLD</span>
                    <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #002b49;">Obesidad, Esteatosis Hepática Metabólica y Riesgo Cardiovascular</h3>
                    <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">Biomarcadores lipidómicos no invasivos para la diferenciación de NAFL y esteatohepatitis (NASH).</p>
                  </td>
                </tr>
              </table>

              <!-- Research Item 2 -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px;">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #fef3c7; color: #b45309; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-bottom: 4px;">ONCOLOGÍA METABÓLICA</span>
                    <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #002b49;">Cáncer Hepático: Carcinoma Hepatocelular, Colangiocarcinoma y Metástasis</h3>
                    <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">Reprogramación metabólica energética y lipídica en el microambiente tumoral del hígado.</p>
                  </td>
                </tr>
              </table>

              <!-- Research Item 3 -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px;">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #dcfce7; color: #15803d; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-bottom: 4px;">REGENERACIÓN &amp; DILI</span>
                    <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #002b49;">Mecanismos de Daño Hepático y Factores de Transcripción E2Fs</h3>
                    <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">Estrés oxidativo, desregulación de lípidos y factores E2F en daño farmacológico y regeneración hepática.</p>
                  </td>
                </tr>
              </table>

              <!-- Research Item 4 -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px;">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #f3e8ff; color: #7e22ce; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-bottom: 4px;">SGIker &amp; COMPUTACIÓN</span>
                    <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #002b49;">Lipidómica e Integración Computacional (SGIker UPV/EHU)</h3>
                    <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">Espectrometría de masas de alta resolución y Deep Learning para lipidomas clínicos masivos.</p>
                  </td>
                </tr>
              </table>

              <!-- Research Item 5 & 6 -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px;">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #f1f5f9; color: #475569; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-bottom: 4px;">EXPOSOMA &amp; ÓMICAS ESPACIALES</span>
                    <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #002b49;">Exposoma Ambiental, MDCs y Ómicas Espaciales (Spatial Multi-Omics)</h3>
                    <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">Mapeo in situ de zonación celular y disrupción metabólica por contaminantes ambientales.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section: Team & Leadership -->
          <tr>
            <td style="padding: 28px 30px; border-bottom: 1px solid #e2e8f0;">
              <h2 style="margin: 0 0 14px 0; font-size: 18px; font-weight: 700; color: #002b49; border-left: 4px solid #689f38; padding-left: 10px;">
                Coordinación y Equipo
              </h2>
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
                <tr>
                  <td style="vertical-align: top;">
                    <div style="font-size: 15px; font-weight: 700; color: #002b49; margin-bottom: 4px;">Dra. Patricia Aspichueta Celaá</div>
                    <div style="font-size: 12px; color: #689f38; font-weight: 600; margin-bottom: 6px;">Catedrática de Fisiología &bull; Investigadora Principal / Coordinadora</div>
                    <div style="font-size: 12px; color: #475569; line-height: 1.5;">
                      Departamento de Fisiología, Facultad de Medicina y Enfermería (UPV/EHU) &bull; IIS Biocruces Bizkaia
                    </div>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">
                El grupo integra a <strong>10 miembros del Personal Docente e Investigador (PDI)</strong>, 1 Investigadora Ikerbasque Professor, 2 Investigadores Posdoctorales, 6 Investigadores Predoctorales con becas competitivas (FPU, FPI, Gobierno Vasco, UPV/EHU) y 2 Técnicos Especialistas de Apoyo.
              </p>
            </td>
          </tr>

          <!-- Call to Action / Web Link -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #ffffff;">
              <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #002b49;">
                Consulte la Web Oficial del Grupo
              </h3>
              <p style="margin: 0 0 20px 0; font-size: 13px; color: #64748b;">
                Tesis doctorales detalladas, catálogo de publicaciones indexadas JCR y currículums completos del personal.
              </p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td style="background-color: #002b49; border-radius: 6px; padding: 12px 28px;">
                    <a href="https://www.ehu.eus/es/web/lipidsliver" target="_blank" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; display: inline-block;">
                      Visitar Portal Web Oficial &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact & Footer -->
          <tr>
            <td style="background-color: #07090e; padding: 24px 30px; text-align: center; color: #94a3b8; font-size: 12px; line-height: 1.6;">
              <div style="font-weight: 700; color: #ffffff; font-size: 13px; margin-bottom: 6px;">
                Grupo de Investigación Lipids &amp; Liver (IT1560-22)
              </div>
              <div style="margin-bottom: 8px;">
                Facultad de Medicina y Enfermería &bull; Barrio Sarriena s/n, 48940 Leioa (Bizkaia)<br />
                Contacto: <a href="mailto:patricia.aspichueta@ehu.eus" style="color: #8ac63f; text-decoration: none;">patricia.aspichueta@ehu.eus</a>
              </div>
              <div style="font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 12px; margin-top: 12px;">
                &copy; 2026 Universidad del País Vasco / Euskal Herriko Unibertsitatea &bull; IIS Biocruces Bizkaia
              </div>
            </td>
          </tr>

        </table>
        <!-- /Container Card -->
      </td>
    </tr>
  </table>
</body>
</html>"""

    email_out = os.path.join(OUTPUT_DIR, 'email_boletin_inline.html')
    with open(email_out, 'w', encoding='utf-8') as f:
        f.write(email_html)
    print(f"Written: {email_out} ({os.path.getsize(email_out) / 1024:.1f} KB)")

build_full_inline_web()
build_email_newsletter()

