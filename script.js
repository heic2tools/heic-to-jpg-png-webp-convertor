(() => {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const resultsSection = document.getElementById('results');
  const resultsList = document.getElementById('results-list');
  const downloadAllBtn = document.getElementById('download-all');
  const formatBtns = document.querySelectorAll('.format-btn');

  let outputFormat = 'jpeg'; // jpeg | png | webp
  let convertedFiles = []; // { name, blob }

  const mimeFor = (fmt) => ({
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
  }[fmt]);

  const extFor = (fmt) => ({
    jpeg: 'jpg',
    png: 'png',
    webp: 'webp',
  }[fmt]);

  formatBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      formatBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      outputFormat = btn.dataset.format;
    });
  });

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  ['dragenter', 'dragover'].forEach((evt) => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.add('is-dragover');
    });
  });
  ['dragleave', 'drop'].forEach((evt) => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.remove('is-dragover');
    });
  });
  dropZone.addEventListener('drop', (e) => {
    const files = Array.from(e.dataTransfer.files).filter(isHeic);
    if (files.length) handleFiles(files);
  });

  fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files).filter(isHeic);
    if (files.length) handleFiles(files);
    fileInput.value = '';
  });

  function isHeic(file) {
    const name = file.name.toLowerCase();
    return name.endsWith('.heic') || name.endsWith('.heif');
  }

  async function handleFiles(files) {
    resultsSection.hidden = false;
    for (const file of files.slice(0, 20)) {
      const li = document.createElement('li');
      li.className = 'result-item';
      li.innerHTML = `
        <div>
          <span class="name-from">${file.name}</span>
          <span> converting…</span>
        </div>
      `;
      resultsList.appendChild(li);

      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: mimeFor(outputFormat),
          quality: 0.9,
        });

        const outName = file.name.replace(/\.(heic|heif)$/i, `.${extFor(outputFormat)}`);
        const url = URL.createObjectURL(convertedBlob);

        convertedFiles.push({ name: outName, blob: convertedBlob });

        li.innerHTML = `
          <div>
            <span class="name-from">${file.name}</span> →
            <span class="name-to">${outName}</span>
          </div>
          <a href="${url}" download="${outName}">Download</a>
        `;
      } catch (err) {
        li.innerHTML = `
          <div>
            <span class="name-from">${file.name}</span>
            <span style="color:#d97757;"> — conversion failed</span>
          </div>
        `;
        console.error('Conversion failed for', file.name, err);
      }
    }
  }

  downloadAllBtn.addEventListener('click', async () => {
    if (!convertedFiles.length) return;
    const zip = new JSZip();
    convertedFiles.forEach((f) => zip.file(f.name, f.blob));
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'heic2tools-converted.zip';
    a.click();
    URL.revokeObjectURL(url);
  });
})();
