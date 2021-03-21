import {BoxPlotChart} from "@sgratzl/chartjs-chart-boxplot";

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
