document.addEventListener('DOMContentLoaded', () => {
  const versionSelect = document.getElementById('version-select');
  const verseContainer = document.getElementById('verse-container');
  const generateBtn = document.getElementById('generate-btn');
  const downloadBtn = document.getElementById('download-btn');
  let currentVersion = 'kjv'; // Versão padrão

  // Função para buscar um versículo aleatório
  async function fetchRandomVerse() {
    try {
      const response = await fetch(`https://bible-api.com/?random=verse&version=${currentVersion}`);
      const data = await response.json();
      verseContainer.innerHTML = `
        <p class="verse-text">${data.text}</p>
        <p class="verse-reference">${data.reference}</p>
      `;
    } catch (error) {
      verseContainer.innerHTML = '<p class="error">Erro ao buscar versículo. Tente novamente.</p>';
    }
  }

  // Carregar um versículo ao abrir o site
  fetchRandomVerse();

  // Alterar versão da Bíblia
  versionSelect.addEventListener('change', (e) => {
    currentVersion = e.target.value;
    fetchRandomVerse();
  });

  // Gerar novo versículo
  generateBtn.addEventListener('click', fetchRandomVerse);

  // Baixar imagem
  downloadBtn.addEventListener('click', () => {
    html2canvas(verseContainer).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${verseContainer.querySelector('.verse-reference').textContent || 'verse'}.png`;
      link.click();
    });
  });
});
