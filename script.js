function generateChannelLink() {
    const youtubeId = document.getElementById("youtubeId").value.trim();
    const output = document.getElementById("output");

    if (!youtubeId) {
        output.textContent = "Por favor, insira um Channel ID válido.";
        return;
    }

    // Apenas simulação, já que FFmpeg não funciona via GitHub Pages
    output.innerHTML = `Link HLS/M3U8 do Canal: <code>output_channel_${youtubeId}.m3u8</code>`;
}

function generateVideoLink() {
    const youtubeId = document.getElementById("youtubeId").value.trim();
    const output = document.getElementById("output");

    if (!youtubeId) {
        output.textContent = "Por favor, insira um Video ID válido.";
        return;
    }

    // Apenas simulação, já que FFmpeg não funciona via GitHub Pages
    output.innerHTML = `Link HLS/M3U8 do Vídeo: <code>output_video_${youtubeId}.m3u8</code>`;
}
