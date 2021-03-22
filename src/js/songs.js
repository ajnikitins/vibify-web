import {BoxPlotChart} from "@sgratzl/chartjs-chart-boxplot";

export function createSongList(songList) {
  return songList.map((song) => {
    const item = document.createElement("a");
    item.classList.add("list-group-item", "list-group-item-action");
    item.id = `song-${song.id}`;

    item.innerHTML = `
<div class="d-flex align-items-center">
  <img class="me-3" width=40px src="${song.images[2].url}" alt="Album art for ${song.name}">
  <div class="d-inline-block text-truncate">
    <div class="fs-6 text-truncate fw-bold">${song.name}</div>
    <div class="text-muted text-truncate">${song.artistName}</div>
  </div>
</div>`;

    return item;
  });
}

export function createSongChart(ctx, data) {
  return new BoxPlotChart(ctx, {
    // The data for our dataset
    data: {
      labels: ["Acousticness", "Danceability", "Energy", "Instrumentalness", "Liveness", "Speechiness", "Valence"],
      datasets: [{
        label: 'a',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [
          data.acousticness,
          data.danceability,
          data.energy,
          data.instrumentalness,
          data.liveness,
          data.speechiness,
          data.valence
        ]
      }]
    },

    // Configuration options go here
    options: {
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

export function parseSongListFeatures(songList) {
  return songList.map((song) => song.audioFeatures).reduce((acc, song) => {
    for (const feature in acc) {
      if (Object.prototype.hasOwnProperty.call(acc, feature)) {
        acc[feature].push(song[feature]);
      }
    }
    return acc;
  }, {
    acousticness: [],
    danceability: [],
    energy: [],
    instrumentalness: [],
    liveness: [],
    speechiness: [],
    valence: [],
    loudness: [],
    tempo: [],
    duration_ms: []
  });
}
